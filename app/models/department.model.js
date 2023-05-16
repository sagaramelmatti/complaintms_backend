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
        locationId: {
            type: Sequelize.INTEGER
        }
    });
  
    return Department;
  };