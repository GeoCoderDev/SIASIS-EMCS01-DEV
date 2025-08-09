import { Pool, QueryResult } from "pg";
import { RDP02 } from "../../interfaces/shared/RDP02Instancias";
import { RDP02_INSTANCES_DATABASE_URL_MAP } from "../../constants/RDP02_INSTANCES_DISTRIBUTION";

// Tipos para los resultados
interface ReplicationResult {
  instancia: string;
  success: boolean;
  rowCount?: number;
  error?: string;
}

// Recuperar datos del evento
const sqlQuery = process.env.SQL_QUERY;
const sqlParamsJson = process.env.SQL_PARAMS;
const instanciasAActualizarJson = process.env.INSTANCIAS_A_ACTUALIZAR;

if (!sqlQuery) {
  console.error("Error: No se proporcionó la consulta SQL");
  process.exit(1);
}

// Parsear parámetros
let sqlParams: any[] = [];
let instanciasAActualizar: RDP02[] = [];

try {
  if (sqlParamsJson) {
    sqlParams = JSON.parse(sqlParamsJson);
  }

  if (instanciasAActualizarJson) {
    instanciasAActualizar = JSON.parse(instanciasAActualizarJson) as RDP02[];
  }
} catch (error) {
  console.error("Error al parsear parámetros:", error);
  process.exit(1);
}

async function replicateToDatabases(): Promise<void> {
  console.log(
    `Iniciando replicación para ${instanciasAActualizar.length} instancias`
  );
  console.log(`Consulta a replicar: ${sqlQuery}`);
  console.log(`Parámetros: ${JSON.stringify(sqlParams)}`);

  const results: ReplicationResult[] = [];

  for (const instancia of instanciasAActualizar) {
    const dbUrl = RDP02_INSTANCES_DATABASE_URL_MAP.get(instancia);

    if (!dbUrl) {
      console.warn(`URL no disponible para instancia ${instancia}, omitiendo`);
      results.push({ instancia, success: false, error: "URL no configurada" });
      continue;
    }

    console.log(`Replicando en instancia ${instancia}...`);

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: true,
    });

    try {
      const client = await pool.connect();
      try {
        const start = Date.now();
        const result: QueryResult = await client.query(sqlQuery!, sqlParams);
        const duration = Date.now() - start;

        console.log(
          `Operación completada en ${instancia}: ${result.rowCount} filas afectadas en ${duration}ms`
        );

        results.push({
          instancia,
          success: true,
          rowCount: result.rowCount!,
        });
      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error(`Error en instancia ${instancia}:`, error);
      results.push({
        instancia,
        success: false,
        error: error.message,
      });
    } finally {
      await pool.end();
    }
  }

  console.log("Resumen de replicación:");
  console.table(results);

  // Verificar si hubo errores
  const errores = results.filter((r) => !r.success);
  if (errores.length > 0) {
    console.error(
      `Se encontraron ${errores.length} errores durante la replicación`
    );
    process.exit(1);
  }
}

// Ejecutar la función principal
replicateToDatabases()
  .then(() => {
    console.log("Replicación completada con éxito");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error fatal en replicación:", error);
    process.exit(1);
  });
