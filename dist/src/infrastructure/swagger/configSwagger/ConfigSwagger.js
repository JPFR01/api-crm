"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const configDocs_1 = require("../../../../infrastructure/swagger/configSwagger/configDocs");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = configDocs_1.configDocs;
const configPreview = (0, swagger_jsdoc_1.default)(options);
const ConfigSwagger = {
    configPreview: configPreview,
    serve: swagger_ui_express_1.default.serve,
    setup: swagger_ui_express_1.default.setup(configPreview),
};
exports.ConfigSwagger = ConfigSwagger;
