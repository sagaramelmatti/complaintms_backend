module.exports = (sequelize, Sequelize) => {
    const Complaint = sequelize.define("complaint", {

        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
        title: {
            type: Sequelize.STRING(300)
        },
        description: {
            type: Sequelize.STRING(10000)
        },
        userId: {
            type: Sequelize.INTEGER
        },
        departmentId: {
            type: Sequelize.INTEGER
        },
        status: {
            allowNull: false,
            type: Sequelize.STRING(20)
        },
        comment: {
            type: Sequelize.STRING(300)
        },
    });
  
    return Complaint;
  };