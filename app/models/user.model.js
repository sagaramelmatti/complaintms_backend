module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
    	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
      username: {
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
      name: {
        type: Sequelize.STRING
      },
      departmentId: {
        type: Sequelize.INTEGER
      }
    });
  
    return User;
  };
