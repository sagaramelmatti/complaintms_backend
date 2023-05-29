module.exports = (sequelize, Sequelize) => {
    const LocationUsers = sequelize.define("location_users", {
        locationId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        }
    });
  
    return LocationUsers;
  };
