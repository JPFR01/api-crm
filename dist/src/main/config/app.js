"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../../../main/config/routes"));
const middlewares_1 = __importDefault(require("../../../main/config/middlewares"));
const app = (0, express_1.default)();
(0, middlewares_1.default)(app);
const setup = async () => {
    await (0, routes_1.default)(app);
};
setup();
exports.default = app;
