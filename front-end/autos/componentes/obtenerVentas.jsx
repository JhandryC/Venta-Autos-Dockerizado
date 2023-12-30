"use client";

import { useEffect, useState } from "react";
import { obtenerVentas } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";

const ObtenerVentas = () => {
  const [respuesta, setRespuesta] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerVentas("venta", token);
      setRespuesta(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!respuesta || respuesta.length === 0) {
    return <p>No hay ventas disponibles.</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {(rol === "gerente" || rol === "vendedor") && (
        <div
          style={{
            position: "relative",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Link href={"/ventas/registrarVenta"} className="btn btn-warning">
            Registrar Venta
          </Link>
        </div>
      )}

      <ul className="list-group">
        {respuesta.map((venta, index) => (
          <li key={index} className="list-group-item">
            <div className="content">
              <h5>Nro {index + 1}</h5>
              <h5>
                {venta.auto.marca} - {venta.auto.modelo}
              </h5>
              <p>Recargo: ${venta.recargo}</p>
              <p>Precio: ${venta.precioTotal}</p>
              <p>Color: {venta.auto.color}</p>
              <h5>
                {venta.comprador.nombres} {venta.comprador.apellidos}
              </h5>
              <h5>
                {venta.personal.nombres} {venta.personal.apellidos}
              </h5>
              <h5>{formatDate(venta.fecha)}</h5>

              {(rol === "gerente" || rol === "vendedor") && (
                <div className="button-container">
                  <Link
                    href={"ventas/actualizarVenta/" + venta.id}
                    className="btn btn-primary btn-sm"
                  >
                    Modificar
                  </Link>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .list-group {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
        }

        .list-group-item {
          flex: 0 0 calc(48% - 20px);
          margin: 1%;
          list-style: none;
        }

        .content {
          padding-right: 20px;
        }

        .button-container {
          display: flex;
          gap: 5px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ObtenerVentas;
