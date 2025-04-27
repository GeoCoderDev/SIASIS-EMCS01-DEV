// Primero, genera un JWT con tu App ID y clave privada
import jwt from "jsonwebtoken";
import fs from "fs";

const appId = "1231844"; // Tu App ID que aparece en la imagen
const privateKey = fs.readFileSync(
  "sql-siasis-executor.2025-04-26.private-key.pem"
);

const payload = {
  iat: Math.floor(Date.now() / 1000) - 60,
  exp: Math.floor(Date.now() / 1000) + 10 * 60,
  iss: appId,
};

const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

// Luego, usa este JWT para obtener las instalaciones
fetch("https://api.github.com/app/installations", {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    Accept: "application/vnd.github.v3+json",
  },
})
  .then((response) => response.json())
  .then((installations) => {
    console.log(
      "Installation IDs:",
      installations.map((inst: any) => inst.id)
    );
  })
  .catch((error) => console.error("Error:", error));
