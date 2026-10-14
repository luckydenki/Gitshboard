import { useQuery } from "@tanstack/react-query";
import CommonError from "~/utils/common-error";

interface WordPressFeaturedMedia {
    source_url?: string;
}

interface WordPressBlogPost {
    link: string;
    jetpack_featured_media_url?: string;
    _embedded?: {
        "wp:featuredmedia"?: WordPressFeaturedMedia[];
    };
}

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
                const res = await fetch(
                    "https://github.blog/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=wp:featuredmedia",
                ); //WordPress Json

                if (res.ok) {
                    const posts: WordPressBlogPost[] = await res.json();

                    const data: BlogThumbnail[] = posts.map((e) => ({
                        url: e.link,
                        thumbnailUrl:
                            e._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                            e.jetpack_featured_media_url ??
                            null,
                    }));

                    return data;
                } else {
                    throw new CommonError({
                        status: 500,
                        title: "블로그 썸네일 응답 오류",
                        detail: "블로그 썸네일의 응답이 모종의 이유로 정상적이지 못합니다.",
                        type: "",
                    });
                }
            } catch (error) {
                console.error("[useBlogFeedThumbnail] error :", error);
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    console.log("[useBlogFeedThumbnail] ", data);

    return { data, isLoading, isError, error };
}
