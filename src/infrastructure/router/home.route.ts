import { Router } from "express";
import { logMiddleware } from "../middleware/log";
import path from "path";

const router: Router = Router();
/**
 * http://localhost/home GET
 */
router.get("/", logMiddleware,(_req, res) => {
    res.sendFile(path.join(__dirname,"./../../frontend/build", "index.html"))
});

export { router };