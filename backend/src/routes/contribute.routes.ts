import { Router } from "express";
import contributionController from "../controllers/contribution.controllers";
import { checkToken, checkUser } from "../middlewares/auth.middleware";

const contribute_router = Router();

contribute_router.get("/health", (req, res) => {
    res.json({ message: "Contribute route is working!" });
});

contribute_router.get(
    "/:login/commitActivity",
    checkToken,
    checkUser,
    contributionController.getCommitActivity,
);

export default contribute_router;
