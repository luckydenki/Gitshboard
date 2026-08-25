import type { CommonErrorResponse, ErrorStatus } from "~/types/common/common";


class CommonError extends Error implements CommonErrorResponse {
    status: ErrorStatus;
    title: string;
    type: string;
    detail: string;

    constructor(status: ErrorStatus, title: string, type: string, detail: string) {
        super(detail);
        this.status = status;
        this.title = title;
        this.type = type;
        this.detail = detail;
    }
}

export default CommonError;