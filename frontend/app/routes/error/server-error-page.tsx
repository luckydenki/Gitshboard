import ServiceErrorPage from "../../components/common/ServiceErrorPage";

export default function ServerErrorPage() {
    return <ServiceErrorPage status={500} />;
}
