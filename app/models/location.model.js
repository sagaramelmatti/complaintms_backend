module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {

        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
        name: {
            allowNull: false,
            type: Sequelize.STRING
        }
    });
  
    return Location;
  };