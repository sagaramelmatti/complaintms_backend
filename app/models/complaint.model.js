module.exports = (sequelize, Sequelize) => {
    const Complaint = sequelize.define("complaint", {

        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
        title: {
            allowNull: false,
            type: Sequelize.STRING(300)
        },
        description: {
            type: Sequelize.STRING(500)
        },
        userId: {
            type: Sequelize.INTEGER
        },
        locationId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING(10)
        },
        comment: {
            type: Sequelize.STRING(300)
        },
        complaint_added_date: {
            type: 'TIMESTAMP'
        },
        complaint_resolved_date: {
            type: 'TIMESTAMP'
        }

    });
  
    return Complaint;
  };