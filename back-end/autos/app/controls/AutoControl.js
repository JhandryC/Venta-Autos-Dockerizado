"use strict";

var formidable = require("formidable");
var fs = require("fs");
var models = require("../models");
var personal = models.personal;
var auto = models.auto;
var extensionesImagen = ["jpg", "png"];
var maxTamanio = 2 * 1024 * 1024;

class AutoControl {
  async listar(req, res) {
    var lista = await auto.findAll({
      attributes: [
        "marca",
        ["external_id", "id"],
        "modelo",
        "archivo",
        "anio",
        "color",
        "precio",
        "estado",
      ],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async obtener(req, res) {
    const external = req.params.external;
    var lista = await auto.findOne({
      where: { external_id: external },

      attributes: [
        "marca",
        ["external_id", "id"],
        "modelo",
        "archivo",
        "anio",
        "color",
        "precio",
        "estado",
      ],
    });
    if (lista === undefined || lista == null) {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: {} });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: lista });
    }
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async guardar(req, res) {
    if (
      req.body.hasOwnProperty("marca") &&
      req.body.hasOwnProperty("modelo") &&
      req.body.hasOwnProperty("anio") &&
      req.body.hasOwnProperty("color") &&
      req.body.hasOwnProperty("precio") &&
      req.body.hasOwnProperty("personal")
    ) {
      var uuid = require("uuid");
      var perA = await personal.findOne({
        where: { external_id: req.body.personal },
        include: [{ model: models.rol, as: "rol", attributes: ["nombre"] }],
      });

      if (perA == undefined || perA == null) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "El gerente a buscar no existe",
          code: 401,
        });
      } else {
        var data = {
          marca: req.body.marca,
          external_id: uuid.v4(),
          modelo: req.body.modelo,
          anio: req.body.anio,
          color: req.body.color,
          precio: req.body.precio,
          id_personal: perA.id,
          estado: true,
          archivo: "auto.png",
        };
        if (perA.rol.nombre == "gerente") {
          var result = await auto.create(data);
          if (result === null) {
            res.status(401);
            res.json({ msg: "Error", tag: "No se puede crear", code: 401 });
          } else {
            perA.external_id = uuid.v4();
            await perA.save();
            res.status(200);
            res.json({ msg: "OK", code: 200 });
          }
        } else {
          res.status(400);
          res.json({
            msg: "ERROR",
            tag: "Solo los gerentes puede registrar un auto",
            code: 400,
          });
        }
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }

  //GUARDAR FOTO
  async guardarFoto(req, res) {
    const external = req.params.external;

    if (!external) {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "Falta el Auto a modificar, por favor ingresar su id",
        code: 400,
      });
      return;
    }

    var form = new formidable.IncomingForm(),
      files = [];
    form
      .on("file", function (field, file) {
        files.push(file);
      })
      .on("end", function () {
        console.log("OK");
      });

    form.parse(req, async function (err, fields) {
      let listado = files;
      let externalAutoName = fields.nameImage[0];

      let autoModificar = await auto.findOne({
        where: { external_id: external },
      });

      if (!autoModificar) {
        res.status(404);
        res.json({ msg: "ERROR", tag: "Auto no encontrado", code: 404 });
        return;
      }

      for (let index = 0; index < listado.length; index++) {
        var file = listado[index];
        var extension = file.originalFilename.split(".").pop().toLowerCase();

        if (file.size > maxTamanio) {
          res.status(400);
          return res.json({
            msg: "ERROR",
            tag: "El archivo debe ser de 2mb",
            code: 400,
          });
        }

        let extensionesAceptadas = [];
        if (esImagen(extension)) {
          extensionesAceptadas = extensionesImagen;
        } else {
          res.status(400);
          return res.json({
            msg: "ERROR",
            tag: "Tipo de archivo no soportado",
            code: 400,
          });
        }

        if (!extensionesAceptadas.includes(extension)) {
          res.status(400);
          res.json({
            msg: "ERROR",
            tag: "Solo soporta" + extensionesAceptadas,
            code: 200,
          });
        } else {
          const existingImages = autoModificar.archivo
            ? autoModificar.archivo.split(",")
            : [];

          let counter = 1;
          let name;
          do {
            name = `${externalAutoName}_${index + counter}.${extension}`;
            counter++;
          } while (existingImages.includes(name));

          // Verificar el límite de 3 imágenes
          if (existingImages.length >= 4) {
            res.status(400);
            res.json({
              msg: "ERROR",
              tag: "Se ha alcanzado el límite máximo de 3 imágenes por auto.",
              code: 400,
            });
            return;
          }

          fs.rename(
            file.filepath,
            "public/images/" + name,
            async function (err) {
              autoModificar.archivo = autoModificar.archivo
                ? autoModificar.archivo + "," + name
                : name;

              await autoModificar.save();
              res.status(200);
              res.json({ msg: "OK", tag: "Archivo guardado", code: 200 });
            }
          );
        }
      }
    });
  }

  async modificar(req, res) {
    // Obtener el auto a modificar
    const external = req.params.external;

    if (!external) {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "Falta el auto a modificar, por favor ingresar su id",
        code: 400,
      });
      return;
    }

    let transaction;
    try {
      // Iniciar transacción
      transaction = await models.sequelize.transaction();

      // Buscar el auto a modificar
      let autoModificar = await auto.findOne({
        where: { external_id: external },
        transaction,
      });

      // Verificar si el Auto existe
      if (!autoModificar) {
        res.status(404);
        res.json({ msg: "ERROR", tag: "Auto no encontrado", code: 404 });
        return;
      }

      var uuid = require("uuid");
      var perA = autoModificar.persona;

      // Actualizar los campos si se proporcionan en la solicitud
      if (
        req.body.hasOwnProperty("marca") &&
        req.body.hasOwnProperty("modelo") &&
        req.body.hasOwnProperty("anio") &&
        req.body.hasOwnProperty("color") &&
        req.body.hasOwnProperty("precio") &&
        req.body.hasOwnProperty("estado")
      ) {
        autoModificar.marca = req.body.marca;
        autoModificar.modelo = req.body.modelo;
        autoModificar.anio = req.body.anio;
        autoModificar.color = req.body.color;
        autoModificar.precio = req.body.precio;
        autoModificar.external_id = uuid.v4();
        autoModificar.estado = req.body.estado;
      } else {
        res.status(400);
        res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        return;
      }

      // Guardar los cambios y confirmar la transacción
      await autoModificar.save({ transaction });
      await transaction.commit();

      res.status(200);
      res.json({ msg: "OK", code: 200 });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      res.status(500);
      res.json({ msg: "ERROR", code: 500, error_msg: error.message });
    }
  }
}

function esImagen(extension) {
  return extensionesImagen.includes(extension);
}

module.exports = AutoControl;
