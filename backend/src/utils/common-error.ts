import { CommonErrorResponse, ErrorStatus } from "../types/middlewares/common";

class CommonError extends Error implements CommonErrorResponse {
    status: ErrorStatus;
    title: string;
    type: string;
    detail?: string;
    instance? : string;

    constructor({ status, title, type, detail, instance }: CommonErrorResponse) {
        super(detail);
        this.status = status;
        this.title = title;
        this.type = type;
        this.detail = detail;
        this.instance = instance;
    }
}

export default CommonError;