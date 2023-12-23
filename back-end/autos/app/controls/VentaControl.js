"use strict";

var fs = require("fs");
var models = require("../models");
var personal = models.personal;
var comprador = models.comprador;
var auto = models.auto;
var venta = models.venta;

class VentaControl {
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
      req.body.hasOwnProperty("recargo") &&
      req.body.hasOwnProperty("precioTotal") &&
      //req.body.hasOwnProperty("fecha") &&
      req.body.hasOwnProperty("auto") &&
      req.body.hasOwnProperty("comprador") &&
      req.body.hasOwnProperty("personal")
    ) {
      var uuid = require("uuid");
      var perA = await personal.findOne({
        where: { external_id: req.body.personal },
        include: [{ model: models.rol, as: "rol", attributes: ["nombre"] }],
      });

      var autoA = await auto.findOne({
        where: { external_id: req.body.auto },
      });

      var compradorA = await comprador.findOne({
        where: { external_id: req.body.comprador },
      });

      if (perA == undefined || perA == null) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "El personal a buscar no existe",
          code: 401,
        });
      } else {
        var data = {
          external_id: uuid.v4(),
          recargo: req.body.recargo,
          precioTotal: req.body.precioTotal,
          id_auto: autoA.id,
          id_comprador: compradorA.id,
          id_personal: perA.id,

        };
        if (perA.rol.nombre == "gerente") {
          var result = await venta.create(data);
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
            tag: "Solo el personal puede registrar una venta",
            code: 400,
          });
        }
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }

  //MODIFICAR VENTA
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

module.exports = VentaControl;
