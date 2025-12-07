'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
      },
      consultantId: {
        type: Sequelize.INTEGER,
        field: 'fkConsultantId',
        allowNull: true,
        comment: 'Foreign key from Consultant table',
      },
      studentId: {
        type: Sequelize.INTEGER,
        field: 'fkStudentId',
        allowNull: true,
        comment: 'Foreign key from Students table',
      },
      dependOnId: {
        type: Sequelize.INTEGER,
        field: 'fkDependOnId',
        allowNull: true,
        comment: 'Foreign key from DependOn table',
      },
      admissionInClass: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      admissionType: {
        type: Sequelize.ENUM('school', 'academy', 'technical'),
        allowNull: true,
      },
      feeAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      commissionAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      admissionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
      admissionNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('Admissions', {
      fields: ['fkStudentId'],
      type: 'foreign key',
      name: 'Admissions_fk1',
      references: {
        table: 'Students',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Admissions', {
      fields: ['fkConsultantId'],
      type: 'foreign key',
      name: 'Admissions_fk2',
      references: {
        table: 'Consultant',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Admissions', {
      fields: ['fkDependOnId'],
      type: 'foreign key',
      name: 'Admissions_fk3',
      references: {
        table: 'DependOn',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admissions');
  },
};
