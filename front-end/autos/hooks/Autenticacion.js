import { enviar, crearAuto, actualizarAuto } from "./Conexion";
import { save, saveToken, getToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar("login", data);
  //console.log(sesion.jwt);
  if (sesion && sesion.code === 200 && sesion.data.token) {
    saveToken(sesion.data.token);
    save("external_id", sesion.data.external_id);
    save("user", sesion.data.user);
    save("id", sesion.data.id);
    save("rol", sesion.data.rol);
  }
  return sesion;
}

export async function guardarAuto(data) {
  const token = getToken();
  const response = await crearAuto("admin/auto/save", data, token);
  return response;
}

export async function modificarAuto(data, external) {
  const token = getToken();
  const response = await actualizarAuto(
    "admin/auto/modificar/" + external, data, token
  );
  return response;
}
