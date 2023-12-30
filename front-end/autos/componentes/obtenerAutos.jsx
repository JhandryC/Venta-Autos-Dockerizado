"use client";
import { useEffect, useState } from "react";
import { obtenerAutos } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";
import { Carousel } from "react-bootstrap";

const ObtenerAutos = () => {
  const [respuesta, setRespuesta] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      console.log(token);
      const response = await obtenerAutos("autos", token);
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
      {rol === "gerente" && (
        <div
          style={{
            position: "relative",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Link href={"/autos/agregarAuto"} className="btn btn-warning">
            Agregar Auto
          </Link>
        </div>
      )}

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <div className="list-group">
            {respuesta.map((dato, i) => (
              <div key={i} className="list-group-item">
                <div className="content">
                  <h5>
                    {dato.marca} - {dato.modelo}
                  </h5>
                  <p>Precio: ${dato.precio}</p>
                  <p>Color: {dato.color}</p>
                  <p>Año: {dato.anio}</p>

                  {rol === "gerente" && (
                    <div className="button-container">
                      <Link
                        href={"autos/actualizarAutos/" + dato.id}
                        className="btn btn-primary btn-sm"
                      >
                        Modificar
                      </Link>

                      <Link
                        href={"autos/agregarImagen/" + dato.id}
                        className="btn btn-primary btn-sm"
                      >
                        Agregar Imagen
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          {respuesta.map((dato, i) => (
            <div key={i} className="list-group-item">
              <Carousel interval={2000} className="custom-carousel">
                {dato.archivo.split(",").map((nombreArchivo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 custom-carousel-image"
                      src={`http://localhost:3000/images/${nombreArchivo}`}
                      alt={nombreArchivo}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-carousel {
          max-height: 200px;
        }

        .custom-carousel-image {
          max-height: 200px;
          object-fit: contain;
        }

        .list-group {
          display: flex;
          flex-wrap: wrap;
        }

        .list-group-item {
          flex: 0 0 48%;
          margin: 1%;
        }

        .content {
          padding-right: 20px;
        }

        .button-container {
          display: flex;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default ObtenerAutos;
