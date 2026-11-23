import RepoCommunicationContributorsArticle from "~/components/page/repo-dashboard/RepoCommunicationContributorsArticle";
import RepoCommunicationOnboardingExampleSection from "~/components/page/repo-dashboard/RepoCommunicationOnboardingExampleSection";
import RepoCommunicationDiscussionStats from "~/components/page/repo-dashboard/RepoCommunicationDiscussionStats";
import RepoCommunicationDiscussionExampleSection from "~/components/page/repo-dashboard/RepoCommunicationDiscussionExampleSection";
import RepoCommunicationReleasesArticle from "~/components/page/repo-dashboard/RepoCommunicationReleasesArticle";
export default function RepoDashboardCommunicationSection() {
    return (
        <section
            aria-label="커뮤니케이션 현황"
            className="flex min-w-0 flex-col gap-6">
            <RepoCommunicationContributorsArticle />
            <RepoCommunicationOnboardingExampleSection />
            <section
                aria-label="Discussion 현황"
                className="flex flex-wrap gap-6">
                <RepoCommunicationDiscussionStats />
                <RepoCommunicationDiscussionExampleSection />
                <RepoCommunicationReleasesArticle />
            </section>
        </section>
    );
}
