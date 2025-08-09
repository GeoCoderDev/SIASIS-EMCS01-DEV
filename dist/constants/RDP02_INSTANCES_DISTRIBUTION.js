"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDP02_INSTANCES_DATABASE_URL_MAP = exports.PROFESOR_PRIMARIA_INSTANCES = exports.TUTOR_INSTANCES = exports.PROFESOR_SECUNDARIA_INSTANCES = exports.PERSONAL_ADMIN_INSTANCES = exports.AUXILIAR_INSTANCES = exports.DIRECTIVO_INSTANCES = void 0;
const Entornos_1 = require("../interfaces/shared/Entornos");
const RDP02Instancias_1 = require("../interfaces/shared/RDP02Instancias");
const ENTORNO_1 = require("./ENTORNO");
exports.DIRECTIVO_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS1] : [RDP02Instancias_1.RDP02.INS1];
exports.AUXILIAR_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS1] : [RDP02Instancias_1.RDP02.INS1];
exports.PERSONAL_ADMIN_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS1] : [RDP02Instancias_1.RDP02.INS1];
exports.PROFESOR_SECUNDARIA_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS2] : [RDP02Instancias_1.RDP02.INS2];
exports.TUTOR_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS2] : [RDP02Instancias_1.RDP02.INS2];
exports.PROFESOR_PRIMARIA_INSTANCES = ENTORNO_1.ENTORNO === Entornos_1.Entorno.PRODUCCION ? [RDP02Instancias_1.RDP02.INS3] : [RDP02Instancias_1.RDP02.INS3];
exports.RDP02_INSTANCES_DATABASE_URL_MAP = new Map([
    [RDP02Instancias_1.RDP02.INS1, process.env.RDP02_INS1_DATABASE_URL],
    [RDP02Instancias_1.RDP02.INS2, process.env.RDP02_INS2_DATABASE_URL],
    [RDP02Instancias_1.RDP02.INS3, process.env.RDP02_INS3_DATABASE_URL],
]);
