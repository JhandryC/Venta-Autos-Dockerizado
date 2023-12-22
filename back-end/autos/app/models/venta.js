"use strict";

module.exports = (sequelize, DataTypes) => {
  const anime = sequelize.define(
    "anime",
    {
      titulo: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      cuerpo: { type: DataTypes.TEXT, defaultValue: "NONE" },
      archivo: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      tipo_archivo: {type: DataTypes.ENUM(['VIDEO', 'IMAGEN']), defaultValue : "IMAGEN"},
      tipo_anime: {type: DataTypes.ENUM(['NORMAL', 'DEPORTIVA', 'URGENTE', 'SOCIAL', 'TECNOLOGICA']), defaultValue: "NORMAL"},
      fecha: { type: DataTypes.DATEONLY },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  );
  
  return venta;
};