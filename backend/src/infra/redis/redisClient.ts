import {createClient} from 'redis';


const redisUrl = process.env.REDIS_URL || 'redis://localhost:6380';

if(!redisUrl) {
    throw new Error('REDIS_URL is not defined');
}

// Redis 클라이언트는 기본적으로 어떤 url로 redis에 접속할 수 있는지만 명시해주면 간단하게 만든다.
export const redisClient = createClient({
    url : redisUrl    
})

redisClient.on("connect",()=>{
    console.log("Redis client connected");
})

redisClient.on("error",(err)=>{
    console.error("Redis client error", err);
})

redisClient.on("ready",()=>{
    console.log("Redis client ready");
})

redisClient.on("end",()=>{
    console.log("Redis client disconnected");
})


/**
 * 해당 메서드는 Redis 클라이언트가 이미 연결되어 있는지 확인하고, 
 * 연결되어 있지 않다면 connect() 메서드를 호출하여 Redis 서버에 연결을 시도합니다.
 * 
 */
export async function connectRedis(){
    if(redisClient.isOpen){
        return;
    }
    await redisClient.connect();
}