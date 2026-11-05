import { useQuery } from "@tanstack/react-query";

import type { CommonResponse } from "~/types/common/common";

interface BlogThumbnail {
    url: string;
    thumbnailUrl: string | null; //derived
}

/**
 * wordpress를 통해 썸네일을 추출하는 별도의 로직입니다.
 * RSS에서는 제공하지 않아서 별도로 분리한 것도 있고, 이미지가 상대적으로 무겁다보니 비동기적으로 띄우려는 목적도 있음
 *
 * @returns
 */
export default function useBlogFeedThumbnail() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blogThumbNail"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/githubblog/blog/thumbnails"); //WordPress Json
                const json = await res.json();

                if (!res.ok) {
                    throw json;
                }

                const thumbnaildata = json as CommonResponse<BlogThumbnail[]>;

                return thumbnaildata.data;
            } catch (error) {
                console.error("[useBlogFeedThumbnail] error :", error);
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    console.log("[useBlogFeedThumbnail] ", data);

    return { data, isLoading, isError, error };
}
