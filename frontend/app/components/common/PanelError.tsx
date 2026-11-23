import { FiAlertCircle } from "react-icons/fi";

type Props = {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
};

export default function PanelError({
    title = "문제가 발생했어요",
    message = "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    onRetry,
    retryLabel = "다시 시도",
}: Props) {
    return (
        <div
            role="alert"
            className="flex min-h-24 w-full min-w-0 flex-col items-center justify-center gap-3 p-4 text-center">
            <FiAlertCircle
                aria-hidden="true"
                focusable="false"
                className="size-6 shrink-0 text-gray-500"
            />
            <div className="flex w-full min-w-0 flex-col gap-2">
                <p className="text-sm font-semibold break-words">{title}</p>
                <p className="text-sm leading-6 break-words text-gray-500">{message}</p>
            </div>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="bg-panel focus-visible:outline-primary cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2">
                    {retryLabel}
                </button>
            )}
        </div>
    );
}
