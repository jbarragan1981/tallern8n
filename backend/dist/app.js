"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const incidencia_routes_1 = __importDefault(require("./routes/incidencia.routes"));
const proyecto_routes_1 = __importDefault(require("./routes/proyecto.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
app.use((0, cors_1.default)({
    origin: frontendUrl,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routing
app.use('/api/health', health_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/incidencias', incidencia_routes_1.default);
app.use('/api/proyectos', proyecto_routes_1.default);
// Error middleware
app.use(error_middleware_1.errorHandler);
exports.default = app;
