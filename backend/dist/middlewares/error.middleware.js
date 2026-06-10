"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    // Log error message safely
    console.error(`[Error] Status: ${status} - Message: ${message}`);
    res.status(status).json({ message });
};
exports.errorHandler = errorHandler;
