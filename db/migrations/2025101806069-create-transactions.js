'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      consultantId: {
        type: Sequelize.INTEGER,
        field: 'fkConsultantId',
        allowNull: true,
        comment: 'Foreign key from Consultant table',
      },
      transactionType: {
        type: Sequelize.ENUM(
          'bonus_credit',
          'incentive_credit',
          'withdrawal',
          'penalty'
        ),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      transactionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      netAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      admissionId: {
        type: Sequelize.INTEGER,
        field: 'fkAdmissionId',
        allowNull: true,
        comment: 'Foreign key from Admission table',
      },
      paymentDetails: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      referenceType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
      },
      processedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      paymentMethod: {
        type: Sequelize.STRING,
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
    await queryInterface.addConstraint('Transactions', {
      fields: ['fkAdmissionId'],
      type: 'foreign key',
      name: 'bonuses_fk3',
      references: {
        table: 'Admissions',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Transactions', {
      fields: ['fkConsultantId'],
      type: 'foreign key',
      name: 'bonuses_fk1',
      references: {
        table: 'Consultant',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  },
};
