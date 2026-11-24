import { useParams } from "react-router";
import {
    useRepoDashboardProjectBranches,
    useRepoDashboardProjectDeployments,
    useRepoDashboardProjectFiles,
    useRepoDashboardProjectHistory,
    useRepoDashboardProjectOverview,
    useRepoDashboardProjectParticipation,
} from "~/hooks/api/useRepoDashboardProjectStatus";

import { getProjectChartData } from "~/utils/page/repo-project-status";

export default function useRepoDashboardProjectStatusPanels() {
    const { owner, repo } = useParams();
    const overviewQuery = useRepoDashboardProjectOverview(owner, repo);
    const filesQuery = useRepoDashboardProjectFiles(owner, repo);
    const branchesQuery = useRepoDashboardProjectBranches(owner, repo);
    const historyQuery = useRepoDashboardProjectHistory(owner, repo);
    const participationQuery = useRepoDashboardProjectParticipation(owner, repo);
    const deploymentsQuery = useRepoDashboardProjectDeployments(owner, repo);
    const overview = overviewQuery.data;
    const files = filesQuery.data;
    const branches = branchesQuery.data;
    const history = historyQuery.data;
    const participation = participationQuery.data;
    const deployments = deploymentsQuery.data;
    const {
        languageData,
        fileTypeData,
        fileHistory,
        storageHistory,
        participationHistory,
        contributorHistory,
        hasFileHistory,
        hasStorageHistory,
        hasParticipationHistory,
        hasContributorHistory,
    } = getProjectChartData({ overview, files, history, participation });

    return {
        overviewQuery,
        filesQuery,
        branchesQuery,
        historyQuery,
        participationQuery,
        deploymentsQuery,
        overview,
        files,
        branches,
        history,
        participation,
        deployments,
        languageData,
        fileTypeData,
        fileHistory,
        storageHistory,
        participationHistory,
        contributorHistory,
        hasFileHistory,
        hasStorageHistory,
        hasParticipationHistory,
        hasContributorHistory,
    };
}
