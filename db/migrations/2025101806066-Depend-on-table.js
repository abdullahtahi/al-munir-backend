'use strict';

const { AutoIncrement } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DependOn', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      relation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DependOn');
  },
};
