
export interface GithubLanguageNode {
    size: number,
    node: { name: string }
}

export interface GithubLanguageRepositoryNode {
    name: string,
    languages: {
        totalSize: number,
        edges: Array<GithubLanguageNode>
    }
}

export interface GihhubCommitTimeHistoryNode {
    committedDate: string
}

export interface GithubCommitTimeRepositoryNode {
    name: string,
    defaultBranchRef: {
        target: {
            history: {
                nodes: Array<GihhubCommitTimeHistoryNode>
            }
        }
    } | null
}

export interface GithubProjectTopicsNode {
    name: string,
    repositoryTopics: {
        nodes: Array<{
            topic: {
                name: string
            }
        }>
    }
}

export interface DevelopStatsNode {
    defaultBranchRef: {
        target: {
            history: {
                nodes: Array<{ committedDate: string }>
            }
        }
    } | null,
    languages: {
        edges: Array<{
            node: { name: string }
        }>
    },
    repositoryTopics: {
        nodes: Array<{
            topic: { name: string }
        }>
    }
}

export interface ProjectLiveRateNode {
    name: string,
    createdAt: string,
    pushedAt: string | null,
    updatedAt: string,
    isArchived: boolean,
    isFork: boolean
}

export interface GithubRepoCommonResponse<T> {
    user: {
        repositories: {
            nodes: Array<T>
        }
    }
}


export interface DeveloperProfileStats {
    profiles: DeveloperProfileStat[];
    traits: DeveloperTrait[];
}

export interface CommitStats {
    total: number;
    peakHour: number;
    weekendPercent: number;
    timeBuckets: CommitTimeStat[];
    weekdays: WeekdayStat[];
}

export interface ProjectHealthStats {
    total: number;
    active: number;
    idle: number;
    dormant: number;
    archived: number;
    forks: number;
    projects: ProjectHealthItem[];
}

export type ProjectStatus = "Active" | "Idle" | "Dormant" | "Archived";

export interface ProjectHealthItem extends ProjectLiveRateNode {
    status: ProjectStatus;
    daysSincePush: number;
    updatedLabel: string;
}

export interface LanguageStat {
    name: string;
    percent: number;
    size: number;
    color: string;
}

export interface CommitTimeStat {
    label: string;
    count: number;
    percent: number;
}

export interface WeekdayStat {
    label: string;
    count: number;
    heightPercent: number;
}

export interface CategoryStat {
    name: string;
    count: number;
    percent: number;
}

export interface DeveloperProfileStat {
    name: string;
    percent: number;
}

export interface DeveloperTrait {
    title: string;
    detail: string;
}
