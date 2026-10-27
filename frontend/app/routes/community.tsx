import { CommonBackground } from "~/components/common/CommonBackground";
import CommunityMain from "~/components/page/community/CommunityMain";

export default function Community() {
    return (
        <>
            <title>커뮤니티 - Gitshboard</title>
            <meta
                name="description"
                content="Gitshboard 사용자들과 이야기하고 프로젝트를 소개해 보세요."
            />

            <CommonBackground />
            <CommunityMain />
        </>
    );
}
