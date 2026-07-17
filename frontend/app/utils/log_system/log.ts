
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


export function Log(logging : any){
    
    switch(logMode){
        case LogMode.LOG:
            console.log(logging);
            break;
        
        case LogMode.AUTO:
            if(isLocal()){
                console.log(logging);
            }    
            break;
        
        default:
            break;

    }
}
