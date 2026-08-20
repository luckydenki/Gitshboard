import {Router} from "express";
import { authToken, authUser } from "../middlewares/auth.middleware";
import contributionController from "../controllers/contribution.controllers";

const contribute_router = Router();


contribute_router.get("/health", (req, res)=>{
    res.json({ message: 'Contribute route is working!' });
})


contribute_router.get("/commitActivity", authToken, authUser, contributionController.getCommitActivity);

export default contribute_router;