import {Router} from "express";
import { checkToken, checkUser } from "../middlewares/auth.middleware";
import searchController from "../controllers/search.controllers";

const search_router = Router();


search_router.get("/health", (req, res)=>{
    res.json({ message: 'Search route is working!' });
})


search_router.get("/", checkToken, checkUser, searchController.search);



export default search_router;