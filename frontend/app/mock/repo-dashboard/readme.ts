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

// Example README documents before repository data integration.
export const readmeDocumentsMock: ReadmeDocument[] = [
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
                    {
                        label: "API Reference",
                        href: "https://react.dev/reference/react",
                    },
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

export const readmeBaseUrlMock = "https://github.com/facebook/react/blob/main";
