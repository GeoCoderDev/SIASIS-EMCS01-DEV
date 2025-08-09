"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const RDP02_INSTANCES_DISTRIBUTION_1 = require("../../constants/RDP02_INSTANCES_DISTRIBUTION");
const sqlQuery = process.env.SQL_QUERY;
const sqlParamsJson = process.env.SQL_PARAMS;
const instanciasAActualizarJson = process.env.INSTANCIAS_A_ACTUALIZAR;
if (!sqlQuery) {
    console.error("Error: No se proporcionó la consulta SQL");
    process.exit(1);
}
let sqlParams = [];
let instanciasAActualizar = [];
try {
    if (sqlParamsJson) {
        sqlParams = JSON.parse(sqlParamsJson);
    }
    if (instanciasAActualizarJson) {
        instanciasAActualizar = JSON.parse(instanciasAActualizarJson);
    }
}
catch (error) {
    console.error("Error al parsear parámetros:", error);
    process.exit(1);
}
async function replicateToDatabases() {
    console.log(`Iniciando replicación para ${instanciasAActualizar.length} instancias`);
    console.log(`Consulta a replicar: ${sqlQuery}`);
    console.log(`Parámetros: ${JSON.stringify(sqlParams)}`);
    const results = [];
    for (const instancia of instanciasAActualizar) {
        const dbUrl = RDP02_INSTANCES_DISTRIBUTION_1.RDP02_INSTANCES_DATABASE_URL_MAP.get(instancia);
        if (!dbUrl) {
            console.warn(`URL no disponible para instancia ${instancia}, omitiendo`);
            results.push({ instancia, success: false, error: "URL no configurada" });
            continue;
        }
        console.log(`Replicando en instancia ${instancia}...`);
        const pool = new pg_1.Pool({
            connectionString: dbUrl,
            ssl: true,
        });
        try {
            const client = await pool.connect();
            try {
                const start = Date.now();
                const result = await client.query(sqlQuery, sqlParams);
                const duration = Date.now() - start;
                console.log(`Operación completada en ${instancia}: ${result.rowCount} filas afectadas en ${duration}ms`);
                results.push({
                    instancia,
                    success: true,
                    rowCount: result.rowCount,
                });
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            console.error(`Error en instancia ${instancia}:`, error);
            results.push({
                instancia,
                success: false,
                error: error.message,
            });
        }
        finally {
            await pool.end();
        }
    }
    console.log("Resumen de replicación:");
    console.table(results);
    const errores = results.filter((r) => !r.success);
    if (errores.length > 0) {
        console.error(`Se encontraron ${errores.length} errores durante la replicación`);
        process.exit(1);
    }
}
replicateToDatabases()
    .then(() => {
    console.log("Replicación completada con éxito");
    process.exit(0);
})
    .catch((error) => {
    console.error("Error fatal en replicación:", error);
    process.exit(1);
});
