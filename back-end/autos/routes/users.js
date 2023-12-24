var express = require("express");
var router = express.Router();

let jwt = require("jsonwebtoken");

const personalC = require("../app/controls/PersonalControl"); //Primero cargamos el archivo
let personalControl = new personalC(); //Luego creamos el "objeto"

const rolC = require("../app/controls/RolControl"); //Primero cargamos el archivo
let rolControl = new rolC();

const autoC = require("../app/controls/AutoControl"); //Primero cargamos el archivo
let autoControl = new autoC(); //Luego creamos el "objeto"

const cuentaC = require("../app/controls/CuentaControl"); //Primero cargamos el archivo
let cuentaControl = new cuentaC(); //Luego creamos el "objeto"

const compradorC = require("../app/controls/CompradorControl"); //Primero cargamos el archivo
let compradorControl = new compradorC(); //Luego creamos el "objeto"

const ventaC = require("../app/controls/VentaControl"); //Primero cargamos el archivo
let ventaControl = new ventaC(); //Luego creamos el "objeto"

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("HOLA MUNDO");
});

//middleware
const auth = function middleware(req, res, next) {
  const token = req.headers["auto-token"];

  if (token === undefined) {
    res.status(401);
    res.json({
      msg: "ERROR",
      tag: "Falta token",
      code: 401,
    });
  } else {
    require("dotenv").config();
    const key = process.env.KEY_JWT;
    jwt.verify(token, key, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "Token no valido o expirado",
          code: 401,
        });
      } else {
        console.log(decoded.external);
        const models = require("../app/models");
        const cuenta = models.cuenta;
        const rol = models.rol;
        const aux = await cuenta.findOne({
          where: { external_id: decoded.external },
          include: [
            {
              model: models.personal,
              as: "personal",
              attributes: ["apellidos", "nombres", "id_rol"],
            },
          ],
        });
        if (aux === null) {
          res.status(401);
          res.json({
            msg: "ERROR",
            tag: "Token no valido",
            code: 401,
          });
        } else {
          //TODO Autorizacion
          const rolAux = await rol.findOne({
            where: { id: aux.personal.id_rol },
          });
          if (rolAux.nombre === "gerente") {
            // El usuario tiene el rol de gerente, se permite el acceso
            next();
          } else {
            res.status(403);
            res.json({
              msg: "ERROR",
              tag: "Acceso no autorizado, se requiere el rol de gerente",
              code: 403,
            });
          }
        }
      }
    });
  }
  // console.log(req.url);
  // console.log(token);
  // next();
};

//INICIO SESION
router.post("/login", cuentaControl.inicio_sesion);

//ROL
router.get("/admin/rol", auth, rolControl.listar);
router.post("/admin/rol/save", rolControl.guardar);

//PERSONAL
router.get("/admin/personal", personalControl.listar);
router.get("/admin/personal/get/:external", personalControl.obtener);
router.post("/admin/personal/save", personalControl.guardar);
router.put("/admin/personal/modificar/:external", personalControl.modificar);

//COMPRADOR
router.get("/admin/comprador", compradorControl.listar);
router.get("/admin/comprador/get/:external", compradorControl.obtener);
router.post("/admin/comprador/save", compradorControl.guardar);
router.put("/admin/comprador/modificar/:external", compradorControl.modificar);

//AUTO
router.get("/autos", autoControl.listar);
router.get("/autos/get/:external", autoControl.obtener);
router.post("/admin/auto/save", autoControl.guardar);
router.put("/admin/auto/modificar/:external", autoControl.modificar);
router.post("/admin/auto/file/save/:external", autoControl.guardarFoto);

//VENTA
router.get("/venta", ventaControl.listar);
router.get("/autos/get/:external", autoControl.obtener);
router.post("/admin/venta/save", ventaControl.guardar);
router.put("/admin/venta/modificar/:external", ventaControl.modificar);


module.exports = router;
