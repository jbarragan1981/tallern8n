"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Novedad = void 0;
const typeorm_1 = require("typeorm");
const Proyecto_1 = require("./Proyecto");
const Usuario_1 = require("./Usuario");
let Novedad = class Novedad {
    id;
    tipo;
    proyectoId;
    proyecto;
    titulo;
    descripcion;
    severidad;
    estado;
    reportadoPorId;
    reportadoPor;
    asignadoAId;
    asignadoA;
    adjuntoUrl;
    creadoEn;
    actualizadoEn;
};
exports.Novedad = Novedad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], Novedad.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Novedad.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'proyecto_id', nullable: true }),
    __metadata("design:type", Object)
], Novedad.prototype, "proyectoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Proyecto_1.Proyecto),
    (0, typeorm_1.JoinColumn)({ name: 'proyecto_id' }),
    __metadata("design:type", Object)
], Novedad.prototype, "proyecto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Novedad.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Novedad.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'Media' }),
    __metadata("design:type", String)
], Novedad.prototype, "severidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, default: 'abierto' }),
    __metadata("design:type", String)
], Novedad.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'reportado_por', nullable: true }),
    __metadata("design:type", Object)
], Novedad.prototype, "reportadoPorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'reportado_por' }),
    __metadata("design:type", Object)
], Novedad.prototype, "reportadoPor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'asignado_a', nullable: true }),
    __metadata("design:type", Object)
], Novedad.prototype, "asignadoAId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'asignado_a' }),
    __metadata("design:type", Object)
], Novedad.prototype, "asignadoA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'adjunto_url', nullable: true }),
    __metadata("design:type", Object)
], Novedad.prototype, "adjuntoUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Novedad.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Novedad.prototype, "actualizadoEn", void 0);
exports.Novedad = Novedad = __decorate([
    (0, typeorm_1.Entity)({ name: 'novedades' })
], Novedad);
