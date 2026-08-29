import { CommonErrorResponse, ErrorStatus } from "../types/middlewares/common";

/**
 *  해당 클래스는 CommonErrorResponse 인터페이스를 구현하며, 공통적인 오류 정보를 담는 Error 객체를 생성합니다.
 * 
 * - status: HTTP 상태 코드 (예: 400, 404, 500 등)
 * - title: 오류 제목 (예: "Bad Request", "Not Found", "Internal Server Error" 등)
 * - type: 오류 유형을 나타내는 URI (예: "https://docs.github.com/en/graphql/overview/explorer")
 * - detail: 오류에 대한 상세 설명 (선택 사항)
 * - instance: 오류가 발생한 인스턴스 URI (선택 사항)
 */
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