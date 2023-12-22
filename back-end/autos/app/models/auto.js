"use strict";

module.exports = (sequelize, DataTypes) => {
  const auto = sequelize.define(
    "auto",
    {
      marca: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      modelo: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      archivo: { type: DataTypes.STRING(150), defaultValue: "NONE.jpg" },
      anio: { type: DataTypes.INTEGER(4), defaultValue: "NONE" },
      color: {
        type: DataTypes.ENUM([
          "NEGRO",
          "BLANCO",
          "PLATA",
          "AMARILLO",
          "AZUL",
          "ROJO",
        ]),
        defaultValue: "NEGRO",
      },
      precio: { type: DataTypes.DOUBLE, defaultValue: "0" },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  );
  auto.associate = function (models) {
    anime.belongsTo(models.persona, { foreignKey: "id_persona" });
    anime.hasMany(models.comentario, {
      foreignKey: "id_anime",
      as: "comentario",
    });
  };
  return auto;
};
