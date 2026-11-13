import { FiUsers, FiBook } from "react-icons/fi";
import { AccountStats } from "~/components/compound/AccountStats";
import { AccountDashboard } from "~/components/compound/AccountDashboardProfile";

export default function OrgDashboardProfileArticle({
    login,
    name,
    location,
    link,
    introduce,
    githubUrl,
    avatarUrl,
    memberCount,
    repositoryCount,
}: {
    login: string;
    name: string;
    location: string;
    link: Array<string>;
    introduce: string;
    githubUrl: string;
    avatarUrl: string;
    memberCount: number;
    repositoryCount: number;
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
            <AccountStats>
                <AccountStats.Item icon={FiUsers} label="멤버" value={memberCount.toLocaleString()} />
                <AccountStats.Item icon={FiBook} label="공개 저장소" value={repositoryCount.toLocaleString()} />
            </AccountStats>
        </AccountDashboard.ArticleLayout>
    );
}
