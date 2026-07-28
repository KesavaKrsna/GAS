import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import donateRouter from "./donate.js";
import contactRouter from "./contact.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donateRouter);
router.use(contactRouter);

export default router;
