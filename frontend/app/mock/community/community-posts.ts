export const communityCategories = ["공지사항", "자유게시판", "팀원 모집", "레포지토리 홍보"] as const;

export type CommunityCategory = (typeof communityCategories)[number];

const postTitles: Record<CommunityCategory, string[]> = {
    공지사항: [
        "Gitshboard 커뮤니티 이용 안내",
        "게시판 운영 정책을 안내드립니다",
        "서비스 업데이트 예정 안내",
        "프로필 및 전적 페이지 개선 사항",
        "커뮤니티 신고 기능 안내",
    ],
    자유게시판: [
        "요즘 관심 있게 보고 있는 오픈소스가 있나요?",
        "사이드 프로젝트 기술 스택을 고민하고 있습니다",
        "개발 공부 기록을 꾸준히 남기는 방법",
        "처음 오픈소스에 기여해 본 후기",
        "최근 사용해 본 개발 도구를 추천해 주세요",
    ],
    "팀원 모집": [
        "주말 사이드 프로젝트 프론트엔드 팀원을 찾습니다",
        "오픈소스 대시보드를 함께 개발하실 분",
        "토이 프로젝트 백엔드 개발자를 모집합니다",
        "디자이너와 개발자가 함께하는 스터디 모집",
        "데이터 시각화 프로젝트 팀원을 구합니다",
    ],
    "레포지토리 홍보": [
        "작업 시간을 기록하는 CLI 도구를 만들었습니다",
        "React 상태 관리 예제를 모은 레포지토리입니다",
        "초보자를 위한 Git 학습 자료를 공개합니다",
        "개발자 포트폴리오 템플릿을 소개합니다",
        "간단한 데이터 시각화 라이브러리를 만들었습니다",
    ],
};

const thumbnailByCategory: Record<CommunityCategory, string> = {
    공지사항: "/Gitshboard_logo.png",
    자유게시판: "/bg.png",
    "팀원 모집": "/Gitshboard_alpha.png",
    "레포지토리 홍보": "/PNGLogo.png",
};

export const communityPostsMock = communityCategories.flatMap((category, categoryIndex) =>
    Array.from({ length: 23 }, (_, index) => ({
        id: `${categoryIndex + 1}-${index + 1}`,
        category,
        title: postTitles[category][index % postTitles[category].length],
        commentCount: (index * 3 + categoryIndex + 1) % 18,
        author: ["devnote", "open-source-lover", "codingcat", "gitmaster"][
            (index + categoryIndex) % 4
        ],
        createdAt: `2026.10.${String(19 - (index % 12)).padStart(2, "0")}`,
        thumbnail: thumbnailByCategory[category],
    })),
);
