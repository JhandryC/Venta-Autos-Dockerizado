import { enviar } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar("login", data);
  //console.log(sesion.jwt);
  if (sesion && sesion.code === 200 && sesion.data.token) {
    saveToken(sesion.data.token);
    save("external_id", sesion.data.external_id);
    save("user", sesion.data.user);
    save("id", sesion.data.external);
    save("rol", sesion.data.rol);
  }
  return sesion;
}

export async function guardar_censo(data) {}
