import { beforeEach, describe, expect, it, vi } from "vitest";
import {fetchSearchData} from "../app/components/page/home/SearchForm";


/**
 * fetchSearchData 요구사항
 *
 * 1. GitHub public Search API를 우선 호출한다.
 *
 * 2. public API가 성공하면 데이터를 반환한다.
 *
 * 3. public API의 rate limit이 소진되었다면
 *    credentials: "include"로 백엔드 인증 API를 호출한다.
 *
 * 4. public API가 rate limit 이외의 원인으로 실패하면
 *    백엔드를 호출하지 않고 즉시 throw한다.
 *
 * 5. fallback 백엔드 요청도 실패하면 throw한다.
 * @param urlParams 
 * @returns 
 */

describe("fetchSearchData", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });


    it("public API 호출이 성공하면 백엔드 API를 호출하지 않고 결과를 반환한다.", async () => {
        const mockData = {
            total_count: 1,
            incomplete_results: false,
            items: [{ login: "octocat" }]
        };

        const fetchMock = vi.spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(
                new Response(JSON.stringify(mockData), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            );



        const urlParams = new URLSearchParams({
            q: "octocat",
        });

        const data = await fetchSearchData(urlParams);

        // Add assertions based on the expected structure of the data
        expect(data).toEqual(mockData);
            expect(fetchMock).toHaveBeenCalledTimes(1);


        expect(fetchMock.mock.calls[0][0])
            .toContain("https://api.github.com/search/users");

        expect(fetchMock.mock.calls[0][1]?.credentials)
            .toBeUndefined();

    });

    it("public API가 rate limit 이외의 이유로 실패하면 백엔드를 호출하지 않고 throw한다.", async () => {
        const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        message: "Validation Failed"
                    }),
                    {
                        status: 422,
                        headers: {
                            "x-ratelimit-remaining": "9"
                        }
                    }
                )
            );

        const params = new URLSearchParams({
            q: "octocat"
        });

        await expect(
            fetchSearchData(params)
        ).rejects.toThrow();

        // backend fallback이 발생하면 안 됨
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });




    it("public API의 rate limit이 소진되면 백엔드 인증 API를 호출한다.", async () => {
        const mockData = {
            total_count: 1,
            incomplete_results: false,
            items: []
        };

        const fetchMock = vi
            .spyOn(globalThis, "fetch")

            // 1. GitHub public API
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        message: "API rate limit exceeded"
                    }),
                    {
                        status: 403,
                        headers: {
                            "x-ratelimit-remaining": "0"
                        }
                    }
                )
            )

            // 2. 우리 백엔드 인증 API
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify(mockData),
                    {
                        status: 200
                    }
                )
            );

        const params = new URLSearchParams({
            q: "octocat"
        });

        const result = await fetchSearchData(params);

        expect(result).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[1][0])
            .toContain("/api/search/users");

        expect(fetchMock.mock.calls[1][1])
            .toEqual(
                expect.objectContaining({
                    credentials: "include"
                })
            );

    });


    it("public rate limit 소진 후 백엔드 인증 요청도 실패하면 throw한다.", async () => {
        const fetchMock = vi
            .spyOn(globalThis, "fetch")


            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        message: "API rate limit exceeded"
                    }),
                    {
                        status: 403,
                        headers: {
                            "x-ratelimit-remaining": "0"
                        }
                    }
                )
            )


            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        message: "Unauthorized"
                    }),
                    {
                        status: 401
                    }
                )
            );


        const params = new URLSearchParams({
            q: "octocat"
        });


        await expect(
            fetchSearchData(params)
        ).rejects.toThrow();


        expect(fetchMock).toHaveBeenCalledTimes(2);
    });


});