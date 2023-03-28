const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.complaints = require("./complaint.model.js")(sequelize, Sequelize);
db.departments = require("./department.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin"];

db.user.hasMany(db.complaints, { as: "complaints" });

db.complaints.belongsTo(db.departments, {
  foreignKey: "departmentId",
  as: "department",
});

db.complaints.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

db.user.belongsTo(db.departments, {
foreignKey: "departmentId",
  as: "department",
});

module.exports = db;
