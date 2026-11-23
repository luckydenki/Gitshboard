import type { Duration } from "~/types/response/repo-pr-issue";

type Props = { seconds: Duration["medianSeconds"] };

export default function RepoPrIssueDuration({ seconds }: Props) {
    if (seconds === null) return <>표본 없음</>;
    if (seconds >= 86400)
        return <>{(seconds / 86400).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}일</>;
    if (seconds >= 3600)
        return <>{(seconds / 3600).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}시간</>;
    if (seconds >= 60)
        return <>{(seconds / 60).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}분</>;
    return <>{seconds.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}초</>;
}
