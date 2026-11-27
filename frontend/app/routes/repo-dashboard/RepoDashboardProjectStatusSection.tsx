import useRepoDashboardProjectStatusPanels from "~/hooks/api/useRepoDashboardProjectStatusPanels";
import RepoDashboardProjectStatusLanguagePanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusLanguagePanel";
import RepoDashboardProjectStatusFilesPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusFilesPanel";
import RepoDashboardProjectStatusFrameworksPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusFrameworksPanel";
import RepoDashboardProjectStatusStoragePanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusStoragePanel";
import RepoDashboardProjectStatusFileTypesPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusFileTypesPanel";
import RepoDashboardProjectStatusIssuePrPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusIssuePrPanel";
import RepoDashboardProjectStatusHealthPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusHealthPanel";
import RepoDashboardProjectStatusBranchesPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusBranchesPanel";
import RepoDashboardProjectStatusDeploymentsPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusDeploymentsPanel";
import RepoDashboardProjectStatusParticipationPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusParticipationPanel";
import RepoDashboardProjectStatusContributorsPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusContributorsPanel";
import RepoDashboardProjectStatusDeploymentRhythmPanel from "~/components/page/repo-dashboard/project-status/RepoDashboardProjectStatusDeploymentRhythmPanel";

export default function RepoDashboardProjectStatusSection() {
    const status = useRepoDashboardProjectStatusPanels();
    return (
        <section
            aria-label="프로젝트 현황"
            className="flex min-w-0 flex-wrap gap-6">
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusLanguagePanel status={status} />
            </div>
            <div className="w-full min-w-0 xl:w-[calc(66.666667%-0.5rem)]">
                <RepoDashboardProjectStatusFilesPanel status={status} />
            </div>
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusFrameworksPanel status={status} />
            </div>
            <div className="w-full min-w-0 xl:w-[calc(66.666667%-0.5rem)]">
                <RepoDashboardProjectStatusStoragePanel status={status} />
            </div>
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusFileTypesPanel status={status} />
            </div>
            <div className="w-full min-w-0 xl:w-[calc(66.666667%-0.5rem)]">
                <RepoDashboardProjectStatusIssuePrPanel status={status} />
            </div>
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusHealthPanel status={status} />
            </div>
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusBranchesPanel status={status} />
            </div>
            <div className="w-full min-w-0 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333333%-1rem)]">
                <RepoDashboardProjectStatusDeploymentsPanel status={status} />
            </div>
            <div className="w-full min-w-0">
                <RepoDashboardProjectStatusParticipationPanel status={status} />
            </div>
            <div className="w-full min-w-0">
                <RepoDashboardProjectStatusContributorsPanel status={status} />
            </div>
            <div className="w-full min-w-0">
                <RepoDashboardProjectStatusDeploymentRhythmPanel status={status} />
            </div>
        </section>
    );
}
