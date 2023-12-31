"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { guardarVenta } from "@/hooks/Autenticacion";
import { getId, getToken } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";
import { obtenerAutos, obtenerComprador } from "@/hooks/Conexion";

export default function AgregarVenta() {
  const router = useRouter();
  const idPersonal = getId();
  const token = getToken();

  const [autos, setAutos] = useState([]);
  const [compradores, setCompradores] = useState([]);

  // Validaciones
  const validationSchema = Yup.object().shape({
    auto: Yup.string().required("Seleccione un auto"),
    comprador: Yup.string().required("Seleccione un comprador"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  let { errors } = formState;

  useEffect(() => {
    const fetchData = async () => {
      const autosResponse = await obtenerAutos("autos", token);
      const compradoresResponse = await obtenerComprador(
        "admin/comprador",
        token
      );
      const autosDisponibles = autosResponse.datos.filter(
        (auto) => auto.estado
      );

      setAutos(autosDisponibles);
      setCompradores(compradoresResponse.datos);
    };

    fetchData();
  }, []);

  const sendData = async (data) => {
    console.log(data);
    var dato = {
      auto: data.auto,
      comprador: data.comprador,
      personal: idPersonal,
    };

    console.log(dato);
    guardarVenta(dato).then((info) => {
      console.log(info);

      mensajes("Venta realizada correctamente", "OK", "success");

      router.push("/ventas");
    });
  };

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
            border: "2px solid black",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <form onSubmit={handleSubmit(sendData)}>
            <div>
              <div className="form-outline form-white mb-4">
                <label className="form-label">Auto</label>
                <select
                  {...register("auto")}
                  id="auto"
                  className={`form-select ${errors.auto ? "is-invalid" : ""}`}
                  onChange={(e) => setValue("auto", e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione un auto
                  </option>
                  {autos.map((auto) => (
                    <option key={auto.id} value={auto.id}>
                      {auto.marca} - {auto.modelo}
                    </option>
                  ))}
                </select>
                {errors.auto && (
                  <div className="alert alert-danger mt-2">
                    {errors.auto.message}
                  </div>
                )}
              </div>
              <div className="form-outline form-white mb-4">
                <label className="form-label">Comprador</label>
                <select
                  {...register("comprador")}
                  id="comprador"
                  className={`form-select ${
                    errors.comprador ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("comprador", e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione un comprador
                  </option>
                  {compradores.map((comprador) => (
                    <option key={comprador.id} value={comprador.id}>
                      {comprador.nombres} {comprador.apellidos}
                    </option>
                  ))}
                </select>
                {errors.comprador && (
                  <div className="alert alert-danger mt-2">
                    {errors.comprador.message}
                  </div>
                )}
              </div>
              <div>
                <button type="submit" className="btn btn-success">
                  Agregar
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
  );
}
