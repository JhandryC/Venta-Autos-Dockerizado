import Menu from "@/componentes/menu";
import ObtenerAuto from "@/componentes/obtenerAuto";
import Link from "next/link";


export default async function Ninos() {

    return (
        <div className="row">
            <Menu></Menu>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <ObtenerAuto></ObtenerAuto>
                
            </div>
        </div>
    )
}