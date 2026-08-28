import type { CommonErrorResponse, ErrorStatus } from "~/types/common/common";


class CommonError extends Error implements CommonErrorResponse {
    status: ErrorStatus;
    title: string;
    type: string;
    detail: string;
    instance?: string; // 오류가 발생 식별용 인스턴스(URI), 보통 요청 경로를 씀

    constructor({ status, title, type, detail, instance }: CommonErrorResponse) {
        super(detail);
        this.status = status;
        this.title = title;
        this.type = type;
        this.detail = detail || "";
        this.instance = instance;
    }

}

export default CommonError;