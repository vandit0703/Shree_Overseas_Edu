import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import uploadRouter from "./upload";
import testimonialsRouter from "./testimonials";
import teamRouter from "./team";
import servicesRouter from "./services";
import destinationsRouter from "./destinations";
import universitiesRouter from "./universities";
import successStoriesRouter from "./success-stories";
import videosRouter from "./videos";
import galleryRouter from "./gallery";
import consultationsRouter from "./consultations";
import enquiriesRouter from "./enquiries";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/team", teamRouter);
router.use("/services", servicesRouter);
router.use("/destinations", destinationsRouter);
router.use("/universities", universitiesRouter);
router.use("/success-stories", successStoriesRouter);
router.use("/videos", videosRouter);
router.use("/gallery", galleryRouter);
router.use("/consultations", consultationsRouter);
router.use("/enquiries", enquiriesRouter);
router.use("/stats", statsRouter);

export default router;
