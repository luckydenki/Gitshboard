import { Router } from "express";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";
import CommonError from "../utils/common-error";
import Parser from "rss-parser";
import { redisClient } from "../infra/redis/redisClient";

const githubblog_router = Router();

githubblog_router.get("/health", (req, res) => {
    res.json({ message: "Github Blog route is working!" });
});

/**
 * GET /api/githubblog/changelog
 * 깃허브 블로그의 changelog RSS를 가져오는 api
 *
 * aside cache 패턴으로 아마 redis에 하루 단위로 저장할 듯
 *
 * @resoponse {
 *  success : boolean;
 *  status : number;
 *  data : {
 *      title : string;
 *      link : string;
 *      pubDate : string;
 *      description : string;
 *  }
 * }
 *
 */
githubblog_router.get("/changelog", async (req, res) => {
    try {
        const cached_changelogs = await redisClient.get("githubblog:changelog");

        if (cached_changelogs) {
            const commonResponse: CommonResponse<typeof cached_changelogs> = {
                success: true,
                status: 200,
                data: JSON.parse(cached_changelogs),
            };

            console.log("[/gibhubblog/changelog] hit");
            res.json(commonResponse);
            return;
        }

        const response = await fetch("https://github.blog/changelog/feed/", {
            method: "GET",
        });

        const parser = new Parser();

        if (response.ok) {
            const xml = await response.text();
            const feed = await parser.parseString(xml);

            const changelogs = feed.items.slice(0, 5).map((item) => {
                const summary = (item.contentSnippet ?? "").replace(/\s+/g, " ").trim();

                return {
                    title: item.title ?? "",
                    link: item.link ?? "",
                    date: item.pubDate ?? "",
                    summary,
                };
            });

            const commonResponse: CommonResponse<typeof changelogs> = {
                success: true,
                status: 200,
                data: changelogs,
            };

            redisClient.set("githubblog:changelog", JSON.stringify(changelogs));
            console.log("[/gibhubblog/changelog] githubblog:changelog redis save");
            res.json(commonResponse);
        } else {
            throw new Error("Failed to fetch changelog RSS");
        }
    } catch (error) {
        console.error("[githubblog_router] error :", error);

        const errorResponse = CommonError.create400Error(
            "Failed to fetch changelog RSS",
            "/api/githubblog/changelog",
            "GITHUBBLOG-CHANGLOG-001",
        );

        res.status(500).json(errorResponse);
    }
});

/**
 * GET /api/githubblog/blog?latest=true
 * 깃허브 블로그의 changelog RSS를 가져오는 api
 *
 * aside cache 패턴으로 아마 redis에 하루 단위로 저장할 듯
 *
 * @resoponse {
 *  success : boolean;
 *  status : number;
 *  data : {
 *      title : string;
 *      link : string;
 *      pubDate : string;
 *      description : string;
 *  }
 * }
 *
 */
githubblog_router.get("/blog", async (req, res) => {
    try {
        const cached_blogposts = await redisClient.get("githubblog:blogposts");
        if (cached_blogposts) {
            const commonResponse: CommonResponse<typeof cached_blogposts> = {
                status: 200,
                success: true,
                data: JSON.parse(cached_blogposts),
            };
            res.json(commonResponse);
            return;
        }

        const latest = req.query.latest;
        const url =
            latest === "true" ? "https://github.blog/latest/feed/" : "https://github.blog/feed/";
        const response = await fetch(url);

        if (!response) {
            throw new Error("정보 가져오기에 실패했습니다.");
        }

        const parser = new Parser({
            customFields: {
                item: [["dc:creator", "authorName"]],
            },
        });

        const xml = await response.text();
        const feed = await parser.parseString(xml);

        const blogpost = feed.items.map((e) => {
            const id = e.guid ?? "";
            const title = e.title ?? "";
            const publishedAt = e.pubDate ?? "";
            const authorName = e.creator?.trim() ?? "";

            const categories = e.categories;
            //   const categories = [e.querySelector("category")?.textContent ?? ""];
            const url = e.link;

            const post = {
                id,
                title,
                authorName,
                publishedAt,
                categories,
                thumbnailUrl: null,
                url,
            };

            return post;
        });

        //console.log("blogpost", blogpost)

        redisClient.set("githubblog:blogposts", JSON.stringify(blogpost));

        const commonResponse: CommonResponse<typeof blogpost> = {
            status: 200,
            success: true,
            data: blogpost,
        };

        res.json(commonResponse);
    } catch (error) {
        let errorResponse: CommonErrorResponse;

        if (error instanceof Error) {
            errorResponse = CommonError.create500Error(error.message);
        } else {
            errorResponse = CommonError.create500Error();
        }

        console.error("에러 발생");

        res.status(errorResponse.status).json(errorResponse);
    }
});

interface WordPressFeaturedMedia {
    source_url?: string;
}

interface WordPressBlogPost {
    link: string;
    jetpack_featured_media_url?: string;
    _embedded?: {
        "wp:featuredmedia"?: WordPressFeaturedMedia[];
    };
}
interface BlogThumbnail {
    url: string;
    thumbnailUrl: string | null; //derived
}

githubblog_router.get("/blog/thumbnails", async (req, res) => {
    try {
        const cached_thumbnails = await redisClient.get("githubblog:thumbnails");

        if (cached_thumbnails) {
            const commonResponse: CommonResponse<typeof cached_thumbnails> = {
                status: 200,
                success: true,
                data: JSON.parse(cached_thumbnails),
            };
            res.json(commonResponse);
            return;
        }

        const response = await fetch(
            "https://github.blog/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=wp:featuredmedia",
        ); //WordPress Json

        if (response.ok) {
            const posts: WordPressBlogPost[] = await response.json();

            const data: BlogThumbnail[] = posts.map((e) => ({
                url: e.link,
                thumbnailUrl:
                    e._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
                    e.jetpack_featured_media_url ??
                    null,
            }));

            console.log("data : ", data);

            const commonResponse: CommonResponse<BlogThumbnail[]> = {
                status: 200,
                success: true,
                data: data,
            };

            redisClient.set("githubblog:thumbnails", JSON.stringify(data));

            res.json(commonResponse);
        } else {
            throw new CommonError({
                status: 500,
                title: "블로그 썸네일 응답 오류",
                detail: "블로그 썸네일의 응답이 모종의 이유로 정상적이지 못합니다.",
                type: "",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

export default githubblog_router;
