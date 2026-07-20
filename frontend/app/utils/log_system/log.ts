
export enum LogMode{
    UNLOG,
    LOG,
    AUTO
}

export let logMode : LogMode = LogMode.AUTO;

export function isLocal(){
    const host = location.host;

    const a = /localhost|127\.0\.0\.1/; 
    // 정규식 패턴을 사용하여 "localhost" 또는 "127.0.0.1"이 포함되어 있는지 확인합니다.
    

    return a.test(host);
}


function log_switch(logf: Function, logging : any){

    switch (logMode) {
        case LogMode.LOG:
            logf(...logging);
            break;

        case LogMode.AUTO:
            if (isLocal()) {
                logf(...logging);
            }
            break;

        default:
            break;

    }

}


export function Log(...logging : any){
    
    log_switch(console.log, logging);

}


export function ErrorLog(...logging : any){

    log_switch(console.error, logging);

}