import { useQuery } from "@tanstack/react-query";

export default function useChangeLogRSS() {
    const getChangelogRSS = async () => {
        try {
            const res = await fetch("https://github.blog/changelog/feed/");

            if (res.ok) {
                console.log("response ", res);
                const xml = await res.text();

                const document = new DOMParser().parseFromString(xml, "application/xml");

                if (document.querySelector("parsererror")) {
                    throw new Error("RSS XML 형식이 올바르지 않습니다.");
                }

                let items = [...document.querySelectorAll("channel > item")];
                items = items.slice(0, 5);

                const domParser = new DOMParser();

                const news = items.map((item) => {
                    const descriptionHtml = item.querySelector("description")?.textContent ?? "";
                    const htmlDocument = domParser.parseFromString(descriptionHtml, "text/html");

                    const summary = htmlDocument
                        .querySelector("p")
                        ?.textContent?.replace(/\s+/g, " ")
                        .trim();

                    return {
                        title: item.querySelector("title")?.textContent ?? "",
                        url: item.querySelector("link")?.textContent ?? "",
                        date: item.querySelector("pubDate")?.textContent ?? "",
                        description: summary ?? "",
                    };
                });

                // console.log("items :", news);
                return news;
            }
        } catch (e) {
            console.error("error :", e);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["changelogRSS"],
        queryFn: getChangelogRSS,
        staleTime: 5 * 60 * 1000,
    });

    return { data, isLoading, isError, error };
}
