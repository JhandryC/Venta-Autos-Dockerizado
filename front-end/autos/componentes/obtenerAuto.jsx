"use client";
import { useEffect, useState } from "react";
import { obtenerAutos } from "@/hooks/Conexion";
import { getToken, getId } from "@/hooks/SessionUtil";
import Link from "next/link";

const ObtenerAuto = () => {
  const [respuesta, setRespuesta] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      console.log(token);
      const response = await obtenerAutos("autos", token);
      console.log(response);
      setRespuesta(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!respuesta || respuesta.length === 0) {
    return <p>No hay autos disponibles.</p>;
  }

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Precio</th>
            <th>Color</th>
            <th>Estado</th>
            <th>Auto</th>
            <th>Auto</th>
          </tr>
        </thead>
        <tbody>
          {respuesta.map((dato, i) => (
            <tr key={i}>
              <td>{dato.marca}</td>
              <td>{dato.modelo}</td>
              <td>{dato.precio}</td>
              <td>{dato.color}</td>
              <td>{dato.estado ? "Disponible" : "No disponible"}</td>
              <td>
                {dato.archivo.split(",").map((nombreArchivo, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/images/${nombreArchivo}`}
                    style={{ width: "100px", marginRight: "5px" }}
                    alt={nombreArchivo}
                  />
                ))}
              </td>
              <td>
                <btn >Modificar</btn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObtenerAuto;
