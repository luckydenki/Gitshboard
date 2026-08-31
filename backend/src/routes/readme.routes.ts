import { Router } from 'express';
import readmeController from '../controllers/readme.controllers';
import CommonError from '../utils/common-error';
import ErrorSVG from '../render/ErrorSVG';




const readme_router = Router();


readme_router.get('/health', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
})


// GET /api/readme/contribution.svg?username={username}&from={from}&to={to}&width={width}&height={height}
readme_router.get('/commit-activity.svg', readmeController.commitActivity);
//해당 svg가 보여주는 정보는 특정 기간 동안의 커밋 활동입니다. (커밋 수, 커밋 시간대 등)

// GET /api/readme/tech-distribution.svg
readme_router.get('/tech-distribution.svg',readmeController.techDistribution);
//해당 svg가 보여주는 정보는 기술 스택 분포입니다. 주로 사용되는 언어와 그 비율을 시각적으로 보여줍니다.

// GET /api/readme/preferred-commit-time.svg
readme_router.get('/preferred-commit-time.svg',readmeController.preferredCommitTime);
//해당 svg가 보여주는 정보는 선호 커밋 시간대입니다. 주로 활동하는 시간대와 비활동 시간대를 시각적으로 보여줍니다.

// GET /api/readme/weekly-commit-activity.svg
readme_router.get('/weekly-commit-activity.svg', readmeController.weeklyCommitActivity);
// 해당 svg가 보여주는 정보는 딱 한 주간의 커밋 활동입니다. 주간 커밋 수와 시간대별 활동을 시각적으로 보여줍니다.


// 공통 에러처리 훅
readme_router.use(readmeController.notFound);


export default readme_router;
