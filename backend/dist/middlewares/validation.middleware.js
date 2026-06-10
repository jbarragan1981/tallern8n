"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    message: error.errors[0]?.message || 'Datos de entrada inválidos',
                    errors: error.errors,
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
