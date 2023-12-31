"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { obtenerVentas, actualizarVenta } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function EditarVenta() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();
  const [ventaData, setVentaData] = useState({});

  useEffect(() => {
    const obtenerUnaVenta = async () => {
      const response = await obtenerVentas("venta/get/" + external, token);

      if (response.msg === "OK") {
        const ventaData = response.datos;

        setVentaData(ventaData);

        reset({
          personal: ventaData.id_personal,
          modelo: ventaData.id_comprador,
          precio: ventaData.id_auto,
        });
      } else {
        console.error("Error fetching auto data:", response);
      }

      console.log(response);
    };

    obtenerUnaVenta();
  }, []);

  // Validaciones
  const validationSchema = Yup.object().shape({
    personal: Yup.string().required("Ingrese la personal del auto"),
    modelo: Yup.string().required("Ingrese el modelo del auto"),
    auto: Yup.string().required("Ingrese el valor del auto"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm(formOptions);
  let { errors } = formState;

  const estadoValue = watch("estado");

  const sendData = (formData) => {
    var dato = {
      personal: formData.personal,
      modelo: formData.modelo,
      precio: formData.precio,
      anio: formData.anio,
      estado: formData.estado === "Disponible", // Convertir a booleano
      color: selectedColor,
    };

    actualizarVenta("admin/venta/modificar/" + external, dato, token).then(
      () => {
        mensajes("Venta modificada correctamente", "OK", "success");
        router.push("/ventas");
      }
    );
  };

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row", // Cambiado a fila para que estén uno al lado del otro
          }}
        >
          {/* Carrusel de fotos en la primera columna */}
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <div className="list-group">
              <div className="list-group-item">
                <Carousel interval={2000} className="custom-carousel">
                  {ventaData.archivo &&
                    ventaData.archivo.split(",").map((nombreArchivo, index) => (
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
            </div>
          </div>

          {/* Formulario en la segunda columna */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                maxWidth: "600px",
                border: "2px solid black",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <form onSubmit={handleSubmit(sendData)}>
                <div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">personal</label>
                    <input
                      {...register("personal")}
                      name="personal"
                      id="personal"
                      className={`form-control ${
                        errors.personal ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.personal?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Modelo</label>
                    <input
                      {...register("modelo")}
                      name="modelo"
                      id="modelo"
                      className={`form-control ${
                        errors.modelo ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.modelo?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Precio</label>
                    <input
                      {...register("precio")}
                      name="precio"
                      id="precio"
                      className={`form-control ${
                        errors.precio ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.precio?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Año</label>
                    <input
                      {...register("anio")}
                      name="anio"
                      id="anio"
                      className={`form-control ${
                        errors.anio ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.anio?.message}
                    </div>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Estado</label>

                    <select
                      {...register("estado")}
                      value={estadoValue ? "Disponible" : "No Disponible"}
                      onChange={(e) => {
                        const newState = e.target.value === "Disponible";
                        setValue("estado", newState);
                      }}
                      className={`form-control ${
                        errors.estado ? "is-invalid" : ""
                      }`}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="No Disponible">No Disponible</option>
                    </select>

                    <div className="alert alert-danger invalid-feedback">
                      {errors.estado?.message}
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-success">
                      Guardar cambios
                    </button>
                    <Link href="/ventas" className="btn btn-danger">
                      Volver
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
