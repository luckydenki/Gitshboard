import { FiHome, FiRefreshCw } from "react-icons/fi";

interface ServiceErrorPageProps {
    status: 500 | 503;
}

export default function ServiceErrorPage({ status }: ServiceErrorPageProps) {
    const isMaintenance = status === 503;

    return (
        <>
            <title>{`${isMaintenance ? "서비스를 잠시 이용할 수 없습니다" : "서버 오류가 발생했습니다"} - Gitshboard`}</title>
            <meta name="robots" content="noindex" />
            <main className="flex items-center justify-center min-h-[70vh] px-main-x-side py-8 text-github-black [grid-area:main] dark:text-gray-100">
                <section
                    aria-labelledby="service-error-title"
                    className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-lg border border-gray-300 bg-panel p-6 text-center sm:p-8 dark:border-gray-700 dark:bg-gray-900"
                >
                    <p className="text-xs font-semibold tracking-widest text-gray-500">
                        GITSHBOARD / {isMaintenance ? "SERVICE UNAVAILABLE" : "INTERNAL SERVER ERROR"}
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <p aria-hidden="true" className="text-8xl font-bold leading-none tracking-tight text-primary sm:text-9xl">
                            {status}
                        </p>
                        <h1 id="service-error-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {isMaintenance ? "잠시 쉬어가는 중이에요" : "잠시 문제가 생겼어요"}
                        </h1>
                        <p className="max-w-md text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">
                            {isMaintenance
                                ? "서비스 점검 또는 일시적인 과부하로 지금은 이용할 수 없어요."
                                : "요청을 처리하는 중 예기치 않은 오류가 발생했어요."}
                            <br />
                            잠시 후 다시 시도해 주세요.
                        </p>
                    </div>

                    <nav aria-label={`${status} 오류 페이지 메뉴`} className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-700 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            <FiRefreshCw aria-hidden="true" />
                            다시 시도하기
                        </button>
                        <a
                            href="/"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            <FiHome aria-hidden="true" />
                            홈으로 돌아가기
                        </a>
                    </nav>

                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {isMaintenance
                            ? "이용이 가능해지면 다시 접속해 주세요."
                            : "문제가 계속되면 잠시 후 다시 방문해 주세요."}
                    </p>
                </section>
            </main>
        </>
    );
}
