import { redisClient } from "../infra/redis/redisClient";

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

}


const redisRepository = new RedisRepository();

export default redisRepository;