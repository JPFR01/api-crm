"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../main/config/app"));
require('dotenv').config();
const appInsights = require('applicationinsights');
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).setAutoCollectConsole(true, true).start();
const port = Number(process.env.PORT || 3000);
app_1.default.listen(port, () => console.log(`Server running on port: ${port} -  ${process.env.NODE_ENV}`));
