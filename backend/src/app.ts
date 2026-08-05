import express from  'express';
import type {Request, Response} from 'express';
import {graphqlHTTP} from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user_router from './routes/user.routes';
import auth_router from './routes/auth.routes';
import testing_router from './routes/testing.routes';
import repo_router from './routes/repo.routes';
import { TestSchema, root } from './graphql/test';
import search_router from './routes/search.routes';
import { connectRedis } from './infra/redis/redisClient';
import { PrismaClient } from '@prisma/client';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();
const connectPrisma = async()=>await prisma.$connect();


// CORS 설정, localhost:5173에서 오는 요청을 허용하고, 쿠키를 포함하여 요청을 보낼 수 있도록 설정
app.use(cors({
  origin: ['http://localhost:5173', 'https://gitshboard.vercel.app'], //프론트엔드 주소
  credentials : true, //쿠키를 포함하여 요청을 보냄
}));

app.use(express.json());

// URL-encoded 데이터 파싱을 위한 미들웨어, extended 옵션은 중첩된 객체를 허용할지 여부를 결정
app.use(express.urlencoded({extended : true}));

// 쿠키 파싱을 위한 미들웨어, 클라이언트에서 전송된 쿠키를 req.cookies 객체로 파싱하여 사용할 수 있도록 함
app.use(cookieParser());

// 기본 라우트, 서버를 헬스 체크 합니다.
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript 서버 실행 중');
});

app.use('/api/users', user_router);
app.use('/api/auth', auth_router);
app.use('/api/test', testing_router);
app.use('/api/repos', repo_router);
app.use('/api/search', search_router);

app.use((req, res, next)=>{
  const startedAt = performance.now();

  res.on("finish", () => {
    console.log(
      "response time:",
      `${req.method} ${req.originalUrl}:`,
      `${(performance.now() - startedAt).toFixed(2)}ms`
    );
  });
  next();
})

app.use('/graphql', 
  graphqlHTTP({
    schema: TestSchema,
    rootValue : root,
    graphiql: true,

}));



async function bootstrap(){
  try{
    await connectRedis();
    await connectPrisma();

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  
  }
  catch(err){
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

void bootstrap(); 
//void 를 붙히는 것은 반환값을 무시하고, Promise가 처리되지 않은 상태로 남는 것을 방지하기 위함임.
//보통 eslint 설정에서는 promise를 사용후 then이나 catch를 사용하지 않을 경우
//promise를 해결하지 않았다 판단하고 경로를 발생시키는데
//void는 의도적으로 promise 해결이 필요 없다고 명시하는 것임.