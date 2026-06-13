/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite usar la app en modo dev desde otros equipos de la red local
  // (sin esto, Next bloquea recursos al abrirla desde otra IP). Para multi-equipo,
  // lo MÁS estable es correr en producción (npm run build && npm run start).
  // Si tu IP cambia, agrégala aquí.
  allowedDevOrigins: ["192.168.100.2"],
};

export default nextConfig;
