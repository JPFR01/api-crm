"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoUpdateControllerFactory = void 0;
const PhotoUpdateFactory_1 = require("../../../../../../main/factories/entities/cooperative-member/photo-update/PhotoUpdateFactory");
const LoggerFactory_1 = require("../../../../../../main/factories/repository/logger/LoggerFactory");
const PhotoUpdate_1 = require("../../../../../../v1/presentation/controllers/cooperative-member/photo-update/PhotoUpdate");
const PhotoUpdateControllerFactory = () => {
    return new PhotoUpdate_1.PhotoUpdateController((0, PhotoUpdateFactory_1.PhotoUpdateDataFactory)(), (0, LoggerFactory_1.LoggerFactory)());
};
exports.PhotoUpdateControllerFactory = PhotoUpdateControllerFactory;
