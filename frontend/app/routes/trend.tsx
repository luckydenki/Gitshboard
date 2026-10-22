import { useState } from "react";
import { FiExternalLink, FiStar } from "react-icons/fi";
import { PiGitFork } from "react-icons/pi";
import {
    contributionIssuesMock,
    newlyDiscoveredRepositoriesMock,
    trendingLanguagesMock,
    trendingTopicsMock,
} from "~/mock/trend/trend-insights";
import { trendingDevelopersMock } from "~/mock/trend/trending-developers";
import { trendingRepositoriesMock } from "~/mock/trend/trending-repositories";

const periodOptions = ["오늘", "이번 주", "이번 달"] as const;

const trendingRepositories = trendingRepositoriesMock;

const trendingDevelopers = trendingDevelopersMock;

export default function Trend() {
    const [selectedPeriod, setSelectedPeriod] = useState<(typeof periodOptions)[number]>("오늘");
    const [selectedLanguage, setSelectedLanguage] = useState("전체 언어");

    return (
        <>
            <title>GitHub 트렌드 - Gitshboard</title>
            <meta
                name="description"
                content="GitHub에서 주목받는 프로젝트와 개발자를 살펴보세요."
            />

            <main className="px-main-x-side flex w-full min-w-0 flex-col gap-6 py-8">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold sm:text-3xl">트렌드</h1>
                        <p className="text-sm text-gray-500">
                            GitHub에서 지금 주목받는 프로젝트와 개발자를 살펴보세요.
                        </p>
                    </div>
                    <span className="bg-panel rounded-lg border-1 border-gray-300 p-2 text-xs text-gray-500">
                        예시 데이터
                    </span>
                </header>

                <section
                    aria-label="트렌드 필터"
                    className="bg-panel flex flex-wrap items-center justify-between gap-4 rounded-lg border-1 border-gray-300 p-4">
                    <div className="flex flex-wrap gap-2">
                        {periodOptions.map((period) => {
                            const isSelected = selectedPeriod === period;

                            return (
                                <button
                                    key={period}
                                    type="button"
                                    aria-pressed={isSelected}
                                    className={`cursor-pointer rounded-lg border-1 p-2 text-sm font-medium ${
                                        isSelected
                                            ? "border-primary bg-primary text-white"
                                            : "bg-panel hover:border-primary border-gray-300"
                                    }`}
                                    onClick={() => setSelectedPeriod(period)}>
                                    {period}
                                </button>
                            );
                        })}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-500">
                        언어
                        <select
                            value={selectedLanguage}
                            className="bg-panel cursor-pointer rounded-lg border-1 border-gray-300 p-2 text-inherit"
                            onChange={(event) => setSelectedLanguage(event.target.value)}>
                            <option>전체 언어</option>
                            <option>TypeScript</option>
                            <option>JavaScript</option>
                            <option>Python</option>
                            <option>Rust</option>
                            <option>Go</option>
                        </select>
                    </label>
                </section>

                <div className="flex min-w-0 items-start gap-6 not-xl:flex-col">
                    <section
                        aria-labelledby="trending-repositories-title"
                        className="bg-panel min-w-0 flex-[2] rounded-lg border-1 border-gray-300 p-6 not-xl:w-full">
                        <div className="flex flex-wrap items-end justify-between gap-3 pb-5">
                            <div className="flex flex-col gap-1">
                                <h2
                                    id="trending-repositories-title"
                                    className="text-xl font-bold sm:text-2xl">
                                    주목받는 프로젝트
                                </h2>
                                <p className="text-sm text-gray-500">
                                    선택한 기간에 관심이 모인 공개 레포지토리예요.
                                </p>
                            </div>
                            <span className="text-xs text-gray-500">
                                {selectedPeriod} · {selectedLanguage}
                            </span>
                        </div>

                        <ol className="flex flex-col divide-y divide-gray-300">
                            {trendingRepositories.map((repository, index) => (
                                <li
                                    key={`${repository.owner}/${repository.name}`}
                                    className="flex gap-4 py-5 first:pt-0 last:pb-0">
                                    <span className="w-7 shrink-0 pt-1 text-sm font-bold text-gray-500">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <a
                                                    href={repository.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:text-primary text-lg font-bold break-words">
                                                    <span className="font-medium text-gray-500">
                                                        {repository.owner} /
                                                    </span>{" "}
                                                    {repository.name}
                                                </a>
                                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                                    {repository.description}
                                                </p>
                                            </div>
                                            <span className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                                                {repository.gainedStars} stars
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className={`size-2 rounded-lg ${repository.languageColor}`}
                                                />
                                                {repository.language}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiStar aria-hidden="true" />
                                                {repository.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <PiGitFork aria-hidden="true" />
                                                {repository.forks}
                                            </span>
                                            <a
                                                href={repository.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary ml-auto flex items-center gap-1 font-medium">
                                                GitHub에서 보기
                                                <FiExternalLink aria-hidden="true" />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section
                        aria-labelledby="trending-developers-title"
                        className="bg-panel min-w-80 flex-1 rounded-lg border-1 border-gray-300 p-6 not-xl:w-full not-xl:min-w-0">
                        <div className="flex flex-col gap-1 pb-5">
                            <h2
                                id="trending-developers-title"
                                className="text-xl font-bold sm:text-2xl">
                                주목받는 개발자
                            </h2>
                            <p className="text-sm text-gray-500">
                                인기 프로젝트를 만들고 있는 개발자예요.
                            </p>
                        </div>

                        <ol className="flex flex-col divide-y divide-gray-300">
                            {trendingDevelopers.map((developer, index) => (
                                <li
                                    key={developer.username}
                                    className="flex gap-3 py-5 first:pt-0 last:pb-0">
                                    <span className="w-6 shrink-0 pt-1 text-sm font-bold text-gray-500">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <img
                                        src={`https://github.com/${developer.username}.png?size=96`}
                                        alt=""
                                        className="size-12 shrink-0 rounded-lg border-1 border-gray-300"
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <div>
                                            <a
                                                href={developer.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:text-primary font-bold break-words">
                                                {developer.name}
                                            </a>
                                            <p className="text-xs text-gray-500">
                                                @{developer.username}
                                            </p>
                                        </div>
                                        <div className="bg-panel rounded-lg border-1 border-gray-300 p-3">
                                            <p className="text-xs text-gray-500">인기 프로젝트</p>
                                            <p className="mt-1 text-sm font-semibold break-words">
                                                {developer.repository}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                {developer.repositoryDescription}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <a
                                                href={developer.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary font-medium">
                                                GitHub에서 보기
                                            </a>
                                            <a
                                                href="/test/myhome"
                                                className="text-primary font-medium">
                                                전적 보기
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                <div className="flex min-w-0 items-stretch gap-6 not-lg:flex-col">
                    <section
                        aria-labelledby="trending-languages-title"
                        className="bg-panel flex min-w-0 flex-1 flex-col rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex flex-col gap-1">
                            <h2
                                id="trending-languages-title"
                                className="text-xl font-bold sm:text-2xl">
                                많이 나타난 언어
                            </h2>
                            <p className="text-sm text-gray-500">
                                트렌드 프로젝트에서 자주 사용된 언어예요.
                            </p>
                        </div>

                        <ol className="mt-6 flex flex-col gap-4">
                            {trendingLanguagesMock.map((language, index) => (
                                <li
                                    key={language.name}
                                    className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex items-center gap-3 font-semibold">
                                            <span className="w-5 text-xs text-gray-500">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            {language.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {language.repositories}개 프로젝트
                                        </span>
                                    </div>
                                    <div className="ml-8 h-2 overflow-hidden rounded-lg bg-gray-200">
                                        <div
                                            className="h-full rounded-lg bg-primary"
                                            style={{ width: `${language.share}%` }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section
                        aria-labelledby="trending-topics-title"
                        className="bg-panel flex min-w-0 flex-1 flex-col rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex flex-col gap-1">
                            <h2
                                id="trending-topics-title"
                                className="text-xl font-bold sm:text-2xl">
                                많이 나타난 분야
                            </h2>
                            <p className="text-sm text-gray-500">
                                프로젝트 설명과 주제에서 자주 발견된 분야예요.
                            </p>
                        </div>

                        <ol className="mt-6 flex flex-col divide-y divide-gray-300">
                            {trendingTopicsMock.map((topic, index) => (
                                <li
                                    key={topic.name}
                                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="w-5 shrink-0 text-xs font-semibold text-gray-500">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0 flex-1 text-sm font-semibold">
                                        {topic.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {topic.repositories}개 프로젝트
                                    </span>
                                    <span className="rounded-lg bg-primary/10 p-2 text-xs font-semibold text-primary">
                                        {topic.change}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>

                <div className="flex min-w-0 items-stretch gap-6 not-xl:flex-col">
                    <section
                        aria-labelledby="newly-discovered-title"
                        className="bg-panel flex min-w-0 flex-1 flex-col rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex flex-col gap-1">
                            <h2
                                id="newly-discovered-title"
                                className="text-xl font-bold sm:text-2xl">
                                새롭게 발견한 프로젝트
                            </h2>
                            <p className="text-sm text-gray-500">
                                최근 트렌드 후보에서 새롭게 눈에 띈 프로젝트예요.
                            </p>
                        </div>

                        <ul className="mt-6 flex flex-col divide-y divide-gray-300">
                            {newlyDiscoveredRepositoriesMock.map((repository) => (
                                <li
                                    key={repository.name}
                                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <a
                                                href={repository.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-bold break-words hover:text-primary">
                                                {repository.name}
                                            </a>
                                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                                {repository.description}
                                            </p>
                                        </div>
                                        <span className="rounded-lg bg-primary/10 p-2 text-xs font-medium text-primary">
                                            {repository.discoveredAt}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        <span>{repository.language}</span>
                                        <a
                                            href={repository.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="ml-auto flex items-center gap-1 font-medium text-primary">
                                            GitHub에서 보기
                                            <FiExternalLink aria-hidden="true" />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section
                        aria-labelledby="contribution-issues-title"
                        className="bg-panel flex min-w-0 flex-1 flex-col rounded-lg border-1 border-gray-300 p-6">
                        <div className="flex flex-col gap-1">
                            <h2
                                id="contribution-issues-title"
                                className="text-xl font-bold sm:text-2xl">
                                기여해 볼 만한 이슈
                            </h2>
                            <p className="text-sm text-gray-500">
                                처음 참여하거나 도움을 보태기 좋은 공개 이슈예요.
                            </p>
                        </div>

                        <ul className="mt-6 flex flex-col divide-y divide-gray-300">
                            {contributionIssuesMock.map((issue) => (
                                <li
                                    key={issue.repository}
                                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-primary">
                                            {issue.repository}
                                        </span>
                                        <a
                                            href={issue.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-bold leading-6 hover:text-primary">
                                            {issue.title}
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {issue.labels.map((label) => (
                                            <span
                                                key={label}
                                                className="rounded-lg border-1 border-gray-300 bg-panel p-2 text-xs text-gray-500">
                                                {label}
                                            </span>
                                        ))}
                                        <span className="ml-auto text-xs text-gray-500">
                                            {issue.updatedAt}
                                        </span>
                                        <a
                                            href={issue.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`${issue.repository} 이슈를 GitHub에서 보기`}
                                            className="flex items-center gap-1 text-xs font-medium text-primary">
                                            GitHub에서 보기
                                            <FiExternalLink aria-hidden="true" />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <p className="text-xs leading-5 text-gray-500">
                    현재 수치와 순위는 UI 구성을 위한 예시입니다. 실제 서비스에서는 데이터 출처,
                    집계 기간, 마지막 업데이트 시각을 함께 표시합니다.
                </p>
            </main>
        </>
    );
}
