import { useState } from "react";
import { FiUser } from "react-icons/fi";
import useUserHeader from "~/hooks/useUserHeader";
import ListLayout, { ListA, ListButton } from "./ListLayout";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "~/types/queryKey/query-key-enum";

export default function HeaderProfileButton() {
    const [open, setOpen] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const { data, isLoading, isError, refetch } = useUserHeader();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutHandler = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                alert("로그아웃 성공");
                queryClient.removeQueries({
                    queryKey: [QueryKeys.AUTH_CHECK],
                    //캐싱된 Auth Check를 무효화 시키기 위한 작업
                });
                navigate("/", {
                    replace: true,
                });
            }
        } catch (e) {}
    };

    if (isLoading)
        return (
            <span
                role="status"
                className="text-sm">
                프로필 로딩 중
            </span>
        );
    if (isError || !data)
        return (
            <button
                type="button"
                className="text-sm"
                onClick={() => refetch()}>
                프로필 조회 실패 · 다시 시도
            </button>
        );

    return (
        <div className="relative">
            <button
                type="button"
                aria-expanded={open}
                aria-label={`${data.login} 프로필 메뉴`}
                className="hover:ring-primary flex items-center justify-between gap-2 rounded-full px-4 py-2 ring-1 not-lg:p-1 hover:cursor-pointer hover:ring-2 lg:w-32"
                onClick={() => setOpen((value) => !value)}>
                {data.avatarUrl && !imageFailed ? (
                    <img
                        src={data.avatarUrl}
                        alt=""
                        className="size-6 rounded-full"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <FiUser
                        aria-hidden="true"
                        className="size-6"
                    />
                )}
                <span className="line-clamp-1 not-lg:hidden">{data.login}</span>
            </button>
            {open && (
                <ListLayout>
                    <ListA
                        href={`/user/${encodeURIComponent(data.login)}`}
                        value="내 프로필"
                    />
                    <ListA
                        href="/settings"
                        value="내 설정"
                    />
                    <ListButton
                        value="로그아웃"
                        callback={logoutHandler}
                    />
                </ListLayout>
            )}
        </div>
    );
}
