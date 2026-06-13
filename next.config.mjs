/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Para usar la app en modo DEV desde otros equipos de la red, cada usuario pone su
  // IP local en su .env.local:  LAN_IP=192.168.x.x  (varias separadas por coma).
  // En modo PRODUCCIÓN (iniciar-en-red.bat) NO hace falta nada de esto.
  allowedDevOrigins: (process.env.LAN_IP ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

export default nextConfig;
