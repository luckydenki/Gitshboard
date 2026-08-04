import Router from "express";
import { authToken } from "../middlewares/auth.middleware";
import { redisClient } from "../infra/redis/redisClient";
import { CommonErrorResponse, CommonResponse } from "../types/middlewares/common";


const testing_router = Router();

// api/testing/health
testing_router.get('/health', (req, res)=>{
    res.send('Server is healthy');
});

// api/testing/authhealth
testing_router.get('/authhealth', authToken, (req, res)=>{
    res.send('Authenticated request is healthy');
});


testing_router.get('/authjson', authToken, (req, res)=>{
    res.json({ 
        message: 'This is a JSON response from an authenticated endpoint',
        name : 'Dench',
        timestamp : new Date().toISOString(),
        description : 'This endpoint is used to test authenticated JSON responses in the Dench testing suite'
        
    });
})

testing_router.get('/authformdata', authToken, (req, res)=>{
    const formData = new FormData();
    formData.append('message', 'This is a FormData response from an authenticated endpoint');
    res.send(formData);
})

// api/testing/health (POST)
testing_router.post('/health', (req, res)=>{
    console.log("Received POST request to /api/testing/health with body:", req.body);
    const { message } = req.body;
    res.json({ message : `Received message: ${message}` });
});


// api/testing/authhealth (POST)
testing_router.post('/authhealth', authToken, (req, res) => {
    console.log("Received POST request to /api/testing/authhealth with body:", req.body);
    const { message } = req.body;
    res.json({ message: `Received message: ${message}` });
});

// api/testing/health (PUT)
testing_router.put('/health', (req, res)=>{
    const { message } = req.body;
    res.json({ message : `Received PUT message: ${message}` });
});

// api/testing/health (DELETE)
testing_router.delete('/health', (req, res)=>{
    res.json({ message : 'Received DELETE request' });
});


//redis에서 키값을 사용할 때
//a:b 라고 치면 a라는 namespace 안에 b라는 key를 사용한다는 의미이다.
//그냥 쉽게 말해 a가 폴더임.
testing_router.get("/redis", async(req, res)=>{
    try{
        await redisClient.set("gitshboard:test", "Redis is working! " + new Date().toISOString(),{
            expiration : {type : 'EX', value : 60} // 60초 동안 유지
        });

        try{
        const redis_response = (await redisClient.get("gitshboard:test")) ?? "";
            
        const response : CommonResponse<String> = {
            success : true,
            status : 200,
            data : redis_response
        }
    
        res.status(200).json(response);
        }catch(err){
            console.error("Error getting value from Redis:", err);
            const errorResponse : CommonErrorResponse = {
                type : "RedisError",
                title : "Failed to get value from Redis",
                status : 500,
                detail : "An error occurred while trying to get a value from Redis. Please check the server logs for more details.",
                instance : "/api/testing/redis"
            }
            res.status(500).json({ error: "Failed to get value from Redis", errorResponse });
        }

    }
    catch(err){
        console.error("Error setting value in Redis:", err);

        const errorResponse : CommonErrorResponse = {
            type : "RedisError",
            title : "Failed to set value in Redis",
            status : 500,
            detail : "An error occurred while trying to set a value in Redis. Please check the server logs for more details.",
            instance : "/api/testing/redis"
        }

        res.status(500).json({ error: "Failed to set value in Redis", errorResponse });
        return;
    }
    
})

export default testing_router;