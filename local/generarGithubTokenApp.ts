import fs from "fs";
import jwt from "jsonwebtoken";

// Reemplaza estos valores con tus propios datos
const appId = "1231844";
const privateKeyPath = "sql-siasis-executor.2025-04-26.private-key.pem";

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Crear el JWT
const payload = {
  iat: Math.floor(Date.now() / 1000) - 60,
  exp: Math.floor(Date.now() / 1000) + 10 * 60, // 10 minutos
  iss: appId,
};

const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
console.log(token);
