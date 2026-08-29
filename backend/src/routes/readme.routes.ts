import { Router } from 'express';
import readmeController from '../controllers/readme.controllers';



const readme_router = Router();


readme_router.get('/health', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
})


readme_router.get('/', (req, res)=>{
    res.json({ message: 'Readme route is working!' });
});



// GET /api/readme/contribution.svg
readme_router.get('/commit-activity.svg', readmeController.commitActivity);



export default readme_router;
