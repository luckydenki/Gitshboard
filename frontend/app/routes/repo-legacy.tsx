import { Navigate, useParams } from "react-router";

export default function RepoLegacy() {
    const { legacy } = useParams();
    const parts = (legacy ?? "").split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return <p role="alert">저장소 주소에 소유자와 저장소 이름이 필요합니다.</p>;
    }
    return <Navigate to={`/repo/${parts.map(encodeURIComponent).join("/")}`} replace />;
}
