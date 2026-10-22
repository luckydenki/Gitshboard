import { useState } from "react";
import { FiBookOpen, FiExternalLink } from "react-icons/fi";

type ReadmeSection = {
    heading: string;
    body: string;
    code?: string;
    links?: { label: string; href: string }[];
};

type ReadmeDocument = {
    path: string;
    title: string;
    description: string;
    highlights?: string[];
    sections: ReadmeSection[];
};

// 저장소 데이터 연동 전, 경로별 README 선택 화면을 보여주기 위한 예시 문서입니다.
const readmeDocuments: ReadmeDocument[] = [
    {
        path: "README.md",
        title: "React",
        description: "React is a JavaScript library for building user interfaces.",
        highlights: ["Declarative", "Component-Based", "Learn Once, Write Anywhere"],
        sections: [
            {
                heading: "Installation",
                body: "React has been designed for gradual adoption from the start. You can use as little or as much React as you need.",
                code: "npm install react react-dom",
            },
            {
                heading: "Usage",
                body: "Create components from individual pieces, then combine them into entire screens, pages, and apps.",
                code: `function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}`,
            },
            {
                heading: "Documentation",
                body: "You can find the React documentation on the website. Check out the Getting Started page for a quick overview.",
                links: [
                    { label: "Learn React", href: "https://react.dev/learn" },
                    { label: "API Reference", href: "https://react.dev/reference/react" },
                ],
            },
            {
                heading: "Contributing",
                body: "The main purpose of this repository is to continue evolving React core, making it faster and easier to use. Development happens in the open on GitHub, and the community is welcome to contribute fixes and improvements.",
            },
        ],
    },
    {
        path: "packages/react/README.md",
        title: "react",
        description: "React의 핵심 API를 제공하는 패키지입니다.",
        sections: [
            {
                heading: "Installation",
                body: "React 패키지를 프로젝트에 설치합니다.",
                code: "npm install react",
            },
            {
                heading: "Usage",
                body: "컴포넌트를 만들고 다른 컴포넌트에서 조합해 사용할 수 있습니다.",
                code: `import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
            },
        ],
    },
    {
        path: "packages/react-dom/README.md",
        title: "react-dom",
        description: "React 컴포넌트를 웹 브라우저의 DOM에 렌더링하는 패키지입니다.",
        sections: [
            {
                heading: "Installation",
                body: "웹 애플리케이션에서 React DOM을 사용하려면 패키지를 설치합니다.",
                code: "npm install react-dom",
            },
            {
                heading: "Usage",
                body: "createRoot로 DOM 노드에 React 컴포넌트를 렌더링할 수 있습니다.",
                code: `import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
            },
        ],
    },
];

export default function RepoDashboardReadmeSection() {
    const [selectedPath, setSelectedPath] = useState(readmeDocuments[0].path);
    const selectedReadme =
        readmeDocuments.find((document) => document.path === selectedPath) ?? readmeDocuments[0];
    const githubUrl = `https://github.com/facebook/react/blob/main/${selectedReadme.path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;

    return (
        <section
            aria-label="README 내용"
            className="bg-panel flex min-w-0 flex-col rounded-lg border-1 border-gray-300 md:flex-row">
            <div className="flex flex-col gap-3 border-b-1 border-gray-300 p-4 md:hidden">
                <label htmlFor="readme-path" className="text-sm font-semibold">
                    README 파일 <span className="text-xs font-normal text-gray-500">· 예시 {readmeDocuments.length}개</span>
                </label>
                <select
                    id="readme-path"
                    value={selectedPath}
                    onChange={(event) => setSelectedPath(event.target.value)}
                    className="bg-panel w-full cursor-pointer rounded-lg border-1 border-gray-300 p-3 text-sm">
                    {readmeDocuments.map((document) => (
                        <option key={document.path} value={document.path}>
                            {document.path}
                        </option>
                    ))}
                </select>
            </div>
            <aside className="hidden min-w-0 border-gray-300 md:block md:w-64 md:shrink-0 md:border-r-1">
                <div className="flex items-center justify-between gap-2 border-b-1 border-gray-300 p-4">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                        <FiBookOpen aria-hidden="true" className="text-gray-500" />
                        README 파일
                    </span>
                    <span className="text-xs text-gray-500">
                        예시 {readmeDocuments.length}개
                    </span>
                </div>
                <nav aria-label="README 파일 목록" className="p-2">
                    <ul className="flex flex-col divide-y divide-gray-300">
                        {readmeDocuments.map((document) => {
                            const isSelected = selectedPath === document.path;

                            return (
                                <li key={document.path} className="py-2 first:pt-0 last:pb-0">
                                    <button
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setSelectedPath(document.path)}
                                        className={`w-full cursor-pointer rounded-lg p-3 text-left text-sm break-all ${
                                            isSelected
                                                ? "bg-primary font-semibold text-white"
                                                : "text-gray-500 hover:bg-gray-200"
                                        }`}>
                                        {document.path}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            <div className="min-w-0 flex-1 md:w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-1 border-gray-300 p-4">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold break-all">
                        <FiBookOpen aria-hidden="true" className="shrink-0 text-gray-500" />
                        {selectedReadme.path}
                    </span>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary flex items-center gap-2 text-sm font-semibold">
                        GitHub에서 보기
                        <FiExternalLink aria-hidden="true" />
                    </a>
                </div>

                <article key={selectedReadme.path} className="flex min-w-0 flex-col gap-8 p-4 md:p-8">
                    <header className="flex flex-col gap-4 border-b-1 border-gray-300 pb-8">
                        <h2 className="text-3xl font-bold">{selectedReadme.title}</h2>
                        <p className="max-w-4xl text-base leading-7 text-gray-500">
                            {selectedReadme.description}
                        </p>
                        {selectedReadme.highlights && (
                            <div className="flex flex-wrap gap-2">
                                {selectedReadme.highlights.map((highlight) => (
                                    <span
                                        key={highlight}
                                        className="bg-primary/10 text-primary rounded-lg p-2 text-xs font-semibold">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {selectedReadme.sections.map((section) => (
                        <section key={section.heading} className="flex flex-col gap-3">
                            <h3 className="text-xl font-bold sm:text-2xl">{section.heading}</h3>
                            <p className="text-sm leading-6 text-gray-500">{section.body}</p>
                            {section.code && (
                                <pre className="max-w-full overflow-x-auto rounded-lg border-1 border-gray-300 bg-gray-100 p-4 text-sm leading-6">
                                    <code>{section.code}</code>
                                </pre>
                            )}
                            {section.links && (
                                <ul className="flex flex-col gap-2 text-sm">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href} className="text-primary font-semibold">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </article>
            </div>
        </section>
    );
}
