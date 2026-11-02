import { Link } from "react-router";
import { FiArrowRight, FiHome, FiSearch } from "react-icons/fi";
import { RouteURL } from "../../routes";

export default function NotFoundPage() {
    return (
        <>
            <title>페이지를 찾을 수 없습니다 - Gitshboard</title>
            <meta
                name="robots"
                content="noindex"
            />
            <meta
                name="description"
                content="요청하신 페이지를 찾을 수 없습니다. Gitshboard 홈으로 이동하거나 사용자와 저장소를 검색해 보세요."
            />

            <main className="px-main-x-side text-github-black flex items-center justify-center py-8 [grid-area:main] dark:text-gray-100">
                <section
                    aria-labelledby="not-found-title"
                    className="bg-panel flex w-full max-w-2xl flex-col items-center gap-8 rounded-lg border border-gray-300 p-6 text-center sm:p-8 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-semibold tracking-widest text-gray-500">
                        GITSHBOARD / PAGE NOT FOUND
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <p
                            aria-hidden="true"
                            className="text-primary text-8xl leading-none font-bold tracking-tight sm:text-9xl">
                            404
                        </p>
                        <h1
                            id="not-found-title"
                            className="text-2xl font-bold tracking-tight sm:text-3xl">
                            이 페이지는 찾을 수 없어요
                        </h1>
                        <p className="max-w-md text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">
                            주소가 잘못 입력되었거나 페이지가 이동되었을 수 있어요.
                            <br />
                            주소를 확인하거나 아래 메뉴에서 다시 시작해 보세요.
                        </p>
                    </div>

                    <nav
                        aria-label="404 페이지 이동 메뉴"
                        className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <Link
                            to="/"
                            className="border-primary bg-primary focus-visible:outline-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-700 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4">
                            <FiHome aria-hidden="true" />
                            홈으로 돌아가기
                        </Link>
                        <Link
                            to={RouteURL.search}
                            className="focus-visible:outline-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-gray-700 dark:hover:bg-gray-800">
                            <FiSearch aria-hidden="true" />
                            사용자 · 저장소 검색
                        </Link>
                    </nav>

                    <div className="flex w-full flex-col items-center gap-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            새로운 프로젝트를 찾고 계신가요?
                        </p>
                        <Link
                            to={RouteURL.trend}
                            className="text-primary hover:bg-primary/10 focus-visible:outline-primary flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4">
                            트렌드 둘러보기
                            <FiArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
