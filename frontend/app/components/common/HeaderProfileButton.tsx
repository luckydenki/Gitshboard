import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import ListLayout, { ListA } from "./ListLayout";

export default function HeaderProfileButton() {
    const [open, setOpen] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["user-header"],
        gcTime: 0,
        queryFn: async ({ signal }) => {
            const response = await fetch("/api/users/userheader", { credentials: "include", signal });
            if (!response.ok) throw new Error("프로필 정보를 불러오지 못했습니다.");
            const result = await response.json();
            if (!result.success || typeof result.data?.login !== "string" || typeof result.data?.avatarUrl !== "string") {
                throw new Error("프로필 정보가 올바르지 않습니다.");
            }
            return result.data as { login: string; avatarUrl: string };
        },
    });

    if (isLoading) return <span role="status" className="text-sm">프로필 로딩 중</span>;
    if (isError || !data) return <button type="button" className="text-sm" onClick={() => refetch()}>프로필 조회 실패 · 다시 시도</button>;

    return (
        <div className="relative">
            <button type="button" aria-expanded={open} aria-label={`${data.login} 프로필 메뉴`}
                className="hover:ring-primary flex items-center justify-between gap-2 rounded-full px-4 py-2 ring-1 not-lg:p-1 hover:cursor-pointer hover:ring-2 lg:w-32"
                onClick={() => setOpen((value) => !value)}>
                {data.avatarUrl && !imageFailed ? (
                    <img src={data.avatarUrl} alt="" className="size-6 rounded-full" onError={() => setImageFailed(true)} />
                ) : <FiUser aria-hidden="true" className="size-6" />}
                <span className="line-clamp-1 not-lg:hidden">{data.login}</span>
            </button>
            {open && <ListLayout>
                <ListA href={`/user/${encodeURIComponent(data.login)}`} value="내 프로필" />
                <ListA href="/settings" value="내 설정" />
            </ListLayout>}
        </div>
    );
}
