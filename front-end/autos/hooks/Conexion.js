let URL = "https://computacion.unl.edu.ec/pdml/examen1/";
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
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return responseData;
}

export async function obtenerNinos(recurso, token) {
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

export async function obtenerNinosCensados(recurso, token) {
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

  if (responseData.code === 200) return responseData.info;

  throw new Error(responseData.message);
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
