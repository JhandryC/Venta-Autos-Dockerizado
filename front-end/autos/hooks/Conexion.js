let URL = "http://localhost:3000/api/";
export function url_api() {
  return URL;
}

export async function obtener(recurso) {
  const response = await fetch(URL + recurso);
  return await response.json();
}

export async function enviar(recurso, data) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return responseData;
}

export async function obtenerAutos(recurso, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "auto-token": token,
  };
  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}

export async function obtenerVenta(recurso, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "auto-token": token,
  };
  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}

export async function obtenerComprador(recurso, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "TEST-KEY": token,
  };
  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "GET",
    headers: headers,
  });

  const responseData = await response.json();
  return responseData;
}

export async function crearCenso(recurso, data, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "TEST-KEY": token,
  };

  data.resource = "saveCensus";

  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (responseData.code === 200) return responseData.info;

  throw new Error(responseData.message);
}

export async function actualizarCenso(recurso, data, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "TEST-KEY": token,
  };

  data.resource = "updateCensus";

  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (responseData.code === 200) return responseData.info;

  throw new Error(responseData.message);
}
