'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Incentives', {
      id: {
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      consultantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'fkConsultantId',
        references: {
          model: 'Consultant',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      incentiveType: {
        type: Sequelize.ENUM(
          'computer',
          'mobile',
          'laptop',
          'bike_cd70',
          'bike_honda_cd70',
          'bike_honda_125',
          'car',
          'cash'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      targetAdmissions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      completionPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      createdDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      achievedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveredDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveryNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Incentives');
  },
};
