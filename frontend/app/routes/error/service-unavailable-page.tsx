import ServiceErrorPage from "../../components/common/ServiceErrorPage";

export default function ServiceUnavailablePage() {
    return <ServiceErrorPage status={503} />;
}
