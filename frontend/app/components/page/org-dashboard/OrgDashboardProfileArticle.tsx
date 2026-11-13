import { AccountStatsItem } from "~/components/compound/AccountStats";
import { FaGithub } from "react-icons/fa";
import { AccountDashboard } from "~/components/compound/AccountDashboardProfile";

export default function OrgDashboardProfileArticle({
    login,
    name,
    location,
    link,
    introduce,
    githubUrl,
    avatarUrl,
}: {
    login: string;
    name: string;
    location: string;
    link: Array<string>;
    introduce: string;
    githubUrl: string;
    avatarUrl: string;
}) {
    return (
        //이렇게 하려니 관리하기 개짜증나네요 Compound 패턴이 진지하게 마려움
        <AccountDashboard.ArticleLayout>
            <AccountDashboard.BasicProfile
                login={login}
                name={name}
                location={location}
                link={link}
                introduce={introduce}
                githubUrl={githubUrl}
                avatarUrl={avatarUrl}
            />
            <AccountStatsItem
                icon={FaGithub}
                label="인원"
                value={1}
            />
        </AccountDashboard.ArticleLayout>
    );
}
