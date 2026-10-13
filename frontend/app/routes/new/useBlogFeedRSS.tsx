import { useQuery } from "@tanstack/react-query";

const DC_NAMESPACE = "http://purl.org/dc/elements/1.1/";
const CONTENT_NAMESPACE = "http://purl.org/rss/1.0/modules/content/";

interface GitHubBlogPost {
    id: string;
    title: string;
    publishedAt: string;
    thumbnailUrl: string | null;
    authorName: string;
    categories: string[];
    url: string;
}

export default function useBlogFeedRSS(latest?: boolean) {
    const url = latest ? "https://github.blog/latest/feed/" : "https://github.blog/feed/";

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blog"],
        queryFn: async () => {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const xml = await res.text();

                    const document = new DOMParser().parseFromString(xml, "application/xml");
                    if (document.querySelector("parsererror")) {
                        throw new Error("RSS XML 형식이 올바르지 않습니다.");
                    }

                    let items = [...document.querySelectorAll("channel > item")];

                    const data = items.map((e) => {
                        const id = e.querySelector("guid")?.textContent ?? "";
                        const title = e.querySelector("title")?.textContent ?? "";
                        const publishedAt = e.querySelector("pubDate")?.textContent ?? "";
                        const authorName =
                            e
                                .getElementsByTagNameNS(DC_NAMESPACE, "creator")
                                .item(0)
                                ?.textContent?.trim() ?? "";
                        const categories = [e.querySelector("category")?.textContent ?? ""];
                        const url = e.querySelector("link")?.textContent ?? "";

                        const post: GitHubBlogPost = {
                            id,
                            title,
                            authorName,
                            publishedAt,
                            categories,
                            thumbnailUrl: null,
                            url,
                        };

                        return post;
                    });

                    return data!;
                } else {
                    throw new Error("망했음");
                }
            } catch (error) {
                console.error("error :", error);
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    console.log("useBlogFeedRSS: ", data);

    return { data, isLoading, isError, error };
}
