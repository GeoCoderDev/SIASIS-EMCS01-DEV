import fs from "fs";
import jwt from "jsonwebtoken";

// Reemplaza estos valores con tus propios datos
const appId = "1231844";
const privateKeyPath = "sql-siasis-executor.2025-04-26.private-key.pem";

if (!appId) {
  console.error("Error: La variable de entorno GITHUB_APP_ID no está definida");
  process.exit(1);
}

// Obtener la clave privada
let privateKey: string;

if (privateKeyPath) {
  // Leer clave privada desde archivo
  try {
    privateKey = fs.readFileSync(privateKeyPath, "utf8");
  } catch (error) {
    console.error(
      `Error al leer el archivo de clave privada en ${privateKeyPath}:`,
      error
    );
    process.exit(1);
  }
} else {
  console.error(
    "Error: No se encontró la clave privada. Define GITHUB_PRIVATE_KEY o GITHUB_PRIVATE_KEY_PATH"
  );
  process.exit(1);
}

// Crear payload para el JWT
const now = Math.floor(Date.now() / 1000);
const payload = {
  // Token valido desde 60 segundos antes (para evitar problemas de sincronización de reloj)
  iat: now - 60,
  // Token válido por 10 minutos
  exp: now + 10 * 60,
  // ID de la GitHub App
  iss: appId,
};

try {
  // Firmar el JWT
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  console.log("JWT generado correctamente:");
  console.log(token);

  // Información adicional para uso en Postman
  console.log('\nUtiliza este token para la solicitud "Obtener GitHub JWT"');
  console.log("Establece el header:");
  console.log("Authorization: Bearer " + token);

  // Mostrar cuando expira
  const expirationDate = new Date(payload.exp * 1000);
  console.log(`\nEl token expira: ${expirationDate.toLocaleString()}`);
} catch (error) {
  console.error("Error al generar el JWT:", error);
  process.exit(1);
}
