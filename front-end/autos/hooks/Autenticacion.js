import { enviar } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar("examen.php", data);
  console.log(sesion.jwt);
  if (sesion && sesion.code === 200 && sesion.info.code) {
    saveToken(sesion.info.code);
    save("id", sesion.info.external);
    save("user", sesion.info.email);
    save("userData", JSON.stringify(sesion.info));
  }
  return sesion;
}

export async function guardar_censo(data) {}
