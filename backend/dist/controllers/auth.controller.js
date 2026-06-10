"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    authService = new auth_service_1.AuthService();
    register = async (req, res, next) => {
        try {
            const { nombre, email, password } = req.body;
            const user = await this.authService.register(nombre, email, password);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            const { token, password } = req.body;
            const result = await this.authService.resetPassword(token, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
