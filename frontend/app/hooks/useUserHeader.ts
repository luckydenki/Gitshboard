import { useQuery } from "@tanstack/react-query";

export default function useUserHeader() {
    return useQuery({
        queryKey: ["user-header"],
        gcTime: 0,
        queryFn: async ({ signal }) => {
            const response = await fetch("/api/users/userheader", {
                credentials: "include",
                signal,
            });
            if (!response.ok) throw new Error("프로필 정보를 불러오지 못했습니다.");
            const result = await response.json();
            if (
                !result.success ||
                typeof result.data?.login !== "string" ||
                typeof result.data?.avatarUrl !== "string"
            ) {
                throw new Error("프로필 정보가 올바르지 않습니다.");
            }
            return result.data as { login: string; avatarUrl: string };
        },
    });
}
