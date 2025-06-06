import { Router } from "express";
import { logMiddleware } from "../middleware/log";

const router: Router = Router();
const path = `${process.cwd()}/dist/ecommerce/dist/index.html`
/**
 * http://localhost/home GET
 */
router.get("/", logMiddleware,(_req, res) => {
    res.sendFile(path)
});

export { router };