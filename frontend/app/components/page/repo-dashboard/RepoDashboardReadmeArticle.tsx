import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import "github-markdown-css/github-markdown.css";
import type { GetRepoReadmeContentDto } from "~/types/response/repo-readme";

interface Props {
    content: GetRepoReadmeContentDto;
}

const readmeHtmlSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        div: [...(defaultSchema.attributes?.div ?? []), "align"],
        img: [...(defaultSchema.attributes?.img ?? []), "width", "height"],
    },
};

export default function RepoDashboardReadmeArticle({ content }: Props) {
    const baseUrl = content.htmlUrl.slice(0, content.htmlUrl.lastIndexOf("/") + 1);
    const resolveUrl = (url: string, raw = false) => {
        if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;
        try {
            const resolved = new URL(url, baseUrl).href;
            return raw ? resolved.replace("/blob/", "/raw/") : resolved;
        } catch {
            return url;
        }
    };

    return (
        <article
            className="markdown-body min-w-0 overflow-x-auto p-4 md:p-8"
            style={{ backgroundColor: "transparent" }}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, readmeHtmlSchema]]}
                components={{
                    a: ({ href, ...props }) => (
                        <a
                            {...props}
                            href={href ? resolveUrl(href) : undefined}
                        />
                    ),
                    img: ({ src, ...props }) => (
                        <img
                            {...props}
                            alt={props.alt || "README 이미지"}
                            src={src ? resolveUrl(src, true) : undefined}
                        />
                    ),
                }}>
                {content.markdown}
            </ReactMarkdown>
        </article>
    );
}
