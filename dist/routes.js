"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const account_1 = require("./account/account");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.send('Hello World!');
});
router.post('/account', (req, res, next) => {
    account_1.default.create(req.data);
});
exports.default = router;
//# sourceMappingURL=routes.js.map