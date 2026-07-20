import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import donateRouter from "./donate.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donateRouter);

export default router;
