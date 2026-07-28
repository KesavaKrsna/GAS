import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import donateRouter from "./donate.js";
import contactRouter from "./contact.js";
import videoRouter from "./video.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donateRouter);
router.use(contactRouter);
router.use(videoRouter);

export default router;
