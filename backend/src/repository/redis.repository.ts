import { redisClient } from "../infra/redis/redisClient";
import { isYYYYMMDD } from "../utils/parseDate";

class RedisRepository{

    public  get = async <T>(key: string): Promise<T | null> => {
        try{
        const cachedData = await redisClient.get(key);
        console.log("Redis get : key", key, "cachedData", cachedData);
        if(cachedData){
                return JSON.parse(cachedData) as T;
            }
        }catch(err){
            console.error("Failed to get cache", err);
        }
        return null;
    };



    public set = async <T>(key: string, value: T, expirationInSeconds?: number): Promise<boolean> => {
        const stringValue = JSON.stringify(value);
        
        if (expirationInSeconds) {
            try{
                await redisClient.set(key, stringValue, {
                    EX: expirationInSeconds
                });
                return true;
            } catch(err){
                console.error("Failed to set cache", err);
            }
        } else {
            try{
                await redisClient.set(key, stringValue);
                return true;
            } catch(err){
                console.error("Failed to set cache", err);
            }
        }

        return false;
    };



    public setEx = async <T>(key: string, expirationInSeconds: number, value: T): Promise<boolean> => {
        const stringValue = JSON.stringify(value);
        try{
            await redisClient.setEx(key, expirationInSeconds, stringValue);
            return true;
        } catch(err){
            console.error("Failed to setEx cache", err);
        }   
        return false;
    };


    /**
     * 
     * create Redis Key는 username, key, options를 받아서 Redis Key를 생성하는 함수입니다.
     * 
     * 1. 기본적으로는 username:key 형태로 생성됩니다.
     * 2. options가 존재하면, username:key:additionalKey:from_to:lastKey 형태로 생성됩니다.
     * 3. from과 to는 YYYYMMDD 형태로 입력해야 합니다. 그렇지 않을 경우 throw Error를 발생시킵니다.
     * 
     * ex) 인자 값이 username = "testuser", key = "commitActivity", options = { additionalKey: "svg", from: "20230101", to: "20230131" } 일 경우, 
     * => "testuser:commitActivity:svg:20230101_20230131"
     * 
     * ex2) 인자 값이 username = "testuser", key = "commitActivity", options = { from: "20230101", to: "20230131" } 일 경우,
     * => "testuser:commitActivity:20230101_20230131"
     * 
     * @param username 
     * @param key 
     * @param options 
     * @returns 
     */
    public createRedisKey = (username : string, key : string, options? : {
        additionalKey? : string | string[],
        lastKey? : string | string[],
        from? : string,
        to? : string,
        
    
    }) => {
    
        let init_key = `${username}:${key}`;
    
        if(options){
            if(options.additionalKey){
                if(Array.isArray(options.additionalKey)){
                    init_key += `:${options.additionalKey.join(":")}`;
                }else{
                    init_key += `:${options.additionalKey}`;
                }
            }
            if(options.from && options.to){
                if(!isYYYYMMDD(options.from) || !isYYYYMMDD(options.to)){
                    throw new Error("from과 to는 YYYYMMDD 형식이어야 합니다.");
                }
    
                const from = options.from;
                const to = options.to;
                init_key += `:${from}_${to}`;
            }
            if (options.lastKey) {
                if (Array.isArray(options.lastKey)) {
                    init_key += `:${options.lastKey.join(":")}`;
                } else {
                    init_key += `:${options.lastKey}`;
                }
            }
    
        }
    
        return init_key;
    }
    
    


}


const redisRepository = new RedisRepository();

export default redisRepository;