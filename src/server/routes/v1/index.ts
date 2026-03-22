import { Router, type Request, type Response, type NextFunction } from "express";
import { errors } from "celebrate";
import contactRoutes from "./contact.route.js";
import taskRoutes from "./task.route.js";
import projectRoutes from "./project.route.js";

const router = Router();

router.use("/contact", contactRoutes);
router.use("/task", taskRoutes);
router.use("/project", projectRoutes);

router.get("/health", (_req: Request, res: Response) => {
  res.send("Ok");
});

router.use(errors());

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

router.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default router;
