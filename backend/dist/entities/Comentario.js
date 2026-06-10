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
exports.Comentario = void 0;
const typeorm_1 = require("typeorm");
const Novedad_1 = require("./Novedad");
const Usuario_1 = require("./Usuario");
let Comentario = class Comentario {
    id;
    novedadId;
    novedad;
    autorId;
    autor;
    comentario;
    estadoNuevo;
    creadoEn;
};
exports.Comentario = Comentario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], Comentario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'novedad_id' }),
    __metadata("design:type", String)
], Comentario.prototype, "novedadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Novedad_1.Novedad, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'novedad_id' }),
    __metadata("design:type", Novedad_1.Novedad)
], Comentario.prototype, "novedad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', name: 'autor_id', nullable: true }),
    __metadata("design:type", Object)
], Comentario.prototype, "autorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'autor_id' }),
    __metadata("design:type", Object)
], Comentario.prototype, "autor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Comentario.prototype, "comentario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, name: 'estado_nuevo', nullable: true }),
    __metadata("design:type", Object)
], Comentario.prototype, "estadoNuevo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Comentario.prototype, "creadoEn", void 0);
exports.Comentario = Comentario = __decorate([
    (0, typeorm_1.Entity)({ name: 'comentarios' })
], Comentario);
