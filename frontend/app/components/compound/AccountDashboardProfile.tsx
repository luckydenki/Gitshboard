import {
    AccountDashboardProfileArticleLayout,
    AccountDashboardProfileSectionLayout,
    DashboardLayout,
} from "../common/AccountDashboard/AccountDashboardLayout";
import { AccountDashboardBasicProfileSection } from "../common/AccountDashboard/AccountDashboardProfileArticle";

//그것들이 하나의 묶음으로서 쓰인다는 것을 만들기 위해 이렇게 사용하기도 함
export const AccountDashboard = Object.assign(DashboardLayout, {
    SectionLayout: AccountDashboardProfileSectionLayout,
    ArticleLayout: AccountDashboardProfileArticleLayout,
    BasicProfile: AccountDashboardBasicProfileSection,
});
