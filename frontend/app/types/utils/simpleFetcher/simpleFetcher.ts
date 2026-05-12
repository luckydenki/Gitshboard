

export enum HTTPHeaders {
    CONTENT_TYPE = "Content-Type",
    AUTHORIZATION = "Authorization",
    ACCEPT = "Accept",
    CACHE_CONTROL = "Cache-Control",
    X_API_KEY = " X-Api-Key"
};

export enum ContentType {
    BASIC = "application/octet-stream",
    JSON = "application/json",
    TEXT = "text/plain",
    HTML = "text/html",
    FORM = "application/x-www-form-urlencoded",
    MULTIPART = "multipart/form-data",
    JPEG = "image/jpeg",
    PNG = "image/png",
    GIF = "image/gif",
    MP4 = "video/mp4",
    PDF = "application/pdf"
}


export enum HTTPCredentials {
    INCLUDE = "include",
    ORIGIN = "same-origin",
    OMIT = "omit"
}



export interface FetchFactoryConfig {
    baseURL: string,
    headers?: Record<string, string>,
    credentials?: HTTPCredentials,
    timeout?: number,

    get: <T>(api: string) => Promise<T|null>,
    post: <T>(api: string, data: any) => Promise<T|null>,
    put: <T>(api: string, data: any) => Promise<T|null>,
    delete: <T>(api: string) => Promise<T|null>,
}
