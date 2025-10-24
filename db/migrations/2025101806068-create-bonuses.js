'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bonuses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Consultant',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fromUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Consultant',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bonusType: {
        type: Sequelize.ENUM(
          'direct',
          'indirect_level_1',
          'indirect_level_2',
          'indirect_level_3',
          'indirect_level_4',
          'global',
          'progression'
        ),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      baseAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      levelDepth: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      referenceId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      referenceType: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      earnedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      processedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Bonuses');
  },
};
