module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define("department", {

        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
        name: {
            allowNull: false,
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        city: {
            allowNull: false,
            type: Sequelize.STRING
        },
        contactNo: {
            type: Sequelize.STRING
        }
    });
  
    return Department;
  };