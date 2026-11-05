import { useQuery } from "@tanstack/react-query";
import type { CommonResponse } from "~/types/common/common";

export interface GitHubBlogPost {
    id: string;
    title: string;
    publishedAt: string;
    thumbnailUrl: string | null;
    authorName: string;
    categories: string[];
    url: string;
}

/**
 * RSS에서 Github Blog Feed를 가져오는 훅
 *
 * latest 옵션에 따라 일반적인 피드 내용을 가져올 수도 있고, latest feed의 내용을 가져올 수도 있습니다.
 *
 */
export default function useBlogFeedRSS(latest?: boolean) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["blog"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/githubblog/blog?latest=${latest}`);
                const json = await res.json();

                if (!res.ok) throw json;

                const githubBlogPost = json as CommonResponse<GitHubBlogPost[]>;

                console.log("블로그 포스트", githubBlogPost);

                return githubBlogPost.data;
            } catch (error) {
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    console.log("useBlogFeedRSS: ", data);

    return { data, isLoading, isError, error };
}
