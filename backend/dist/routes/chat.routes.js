"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.default)();
/* @ts-expect-error: */
router.use(auth_middleware_1.authenticateJWT);
/* @ts-expect-error: */
router.get('/messages', (req, res) => {
    return res.send("Oi");
});
exports.default = router;
