module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
    	id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      departmentId: {
        type: Sequelize.INTEGER
      },
      userType: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };
