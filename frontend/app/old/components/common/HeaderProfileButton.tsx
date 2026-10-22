import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useOutletContext } from "react-router";

export default function HeaderProfileButton({
    data,
}: {
    data: { login: string; avatarUrl: string } | undefined;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const auth_refetch = useOutletContext<() => void>();

    const queryClient = useQueryClient();
    // === 은 두 객체가 동일한 인스턴스를 참조하는지 확인합니다.
    // == 은 두 객체가 동일한 값을 가지는지 확인합니다. (참조가 다르더라도 값이 같으면 true를 반환)

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) throw data;
            return data;
        },

        onSuccess: () => {
            auth_refetch();
            queryClient.clear();
            // clear는 queryClient.invalidateQueries()와 달리
            // 캐시를 완전히 제거합니다. 따라서 로그아웃 후에
            // 캐시된 데이터를 다시 가져오게 됩니다.

            alert("로그아웃 되었습니다.");
            dialog.current?.close();
        },

        onError: (error) => {
            throw error;
        },
    });

    return (
        <div className="relative">
            <button
                className={`hover:ring-github-light flex w-32 items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-normal duration-150 hover:ring-2 dark:bg-gray-900`}
                onClick={() => {
                    if (dialog.current?.open) {
                        dialog.current?.close();
                        return;
                    } else {
                        dialog.current?.show();
                    }
                }}>
                {data ? (
                    <img
                        src={data.avatarUrl}
                        alt="avatar"
                        fetchPriority="high"
                        className="h-8 w-8 rounded-full"
                    />
                ) : (
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
                )}

                <span className="overflow-hidden text-sm font-medium text-gray-700 not-sm:hidden dark:text-gray-200">
                    {data?.login}
                </span>
            </button>

            <dialog
                className={`absolute top-full left-0 mt-2 w-32 rounded-lg bg-white shadow-lg dark:bg-gray-900`}
                ref={dialog}>
                <menu
                    className={`flex flex-col gap-2 p-2 text-center [&>button]:hover:bg-gray-300`}>
                    <button onClick={() => logoutMutation.mutate()}>Logout</button>
                </menu>
            </dialog>
        </div>
    );
}
