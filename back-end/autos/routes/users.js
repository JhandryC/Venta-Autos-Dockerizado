var express = require("express");
var router = express.Router();

const personalC = require("../app/controls/PersonalControl"); //Primero cargamos el archivo
let personalControl = new personalC(); //Luego creamos el "objeto"

const rolC = require("../app/controls/RolControl"); //Primero cargamos el archivo
let rolControl = new rolC();

const autoC = require("../app/controls/AutoControl"); //Primero cargamos el archivo
let autoControl = new autoC(); //Luego creamos el "objeto"

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("HOLA MUNDO");
});

//middleware
const auth = function middleware(req, res, next) {
  const token = req.headers["puta-key"];

  console.log(req.headers);

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
        const aux = await cuenta.findOne({
          where: { external_id: decoded.external },
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
          next();
        }
      }
    });
  }
  // console.log(req.url);
  // console.log(token);
  // next();
};

//ROL
router.get("/admin/rol", rolControl.listar);
router.post("/admin/rol/save", rolControl.guardar);

//PERSONAL
router.get("/admin/personal", personalControl.listar);
router.get("/admin/personal/get/:external", personalControl.obtener);
router.post("/admin/personal/save", personalControl.guardar);
router.put("/admin/personal/modificar/:external", personalControl.modificar);

//AUTO
router.get("/autos", autoControl.listar);
router.get("/autos/get/:external", autoControl.obtener);
router.post("/admin/auto/save", autoControl.guardar);
router.put("/admin/auto/modificar/:external", autoControl.modificar);
router.post("/admin/auto/file/save/:external", autoControl.guardarFoto);

module.exports = router;
