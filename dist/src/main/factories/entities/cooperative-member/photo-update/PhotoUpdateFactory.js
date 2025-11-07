"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoUpdateDataFactory = void 0;
const HttpMethodFactory_1 = require("../../../../../../main/factories/repository/http-methods/HttpMethodFactory");
const TokenFactory_1 = require("../../../../../../main/factories/repository/token/TokenFactory");
const PhotoUpdate_1 = require("../../../../../../v1/application/entities/cooperative-member/photo-update/PhotoUpdate");
const PhotoUpdateDataFactory = () => {
    return new PhotoUpdate_1.PhotoUpdate((0, TokenFactory_1.TokenFactory)(), (0, HttpMethodFactory_1.HttpMethodFactory)());
};
exports.PhotoUpdateDataFactory = PhotoUpdateDataFactory;
