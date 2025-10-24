'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Franchises', {
      id: {
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Consultant',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      franchiseName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      franchiseCode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        defaultValue: 'Pakistan',
      },
      contactPhone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      contactEmail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
        allowNull: false,
      },
      establishmentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      franchiseFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      monthlyFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      commissionRate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 10.0,
        allowNull: false,
      },
      targetAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalRevenue: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      services: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('Franchises');
  },
};
