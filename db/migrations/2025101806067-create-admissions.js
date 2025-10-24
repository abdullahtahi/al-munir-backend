'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admissions', {
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
      studentId: {
        type: Sequelize.INTEGER,
        field: 'fkStudentId',
        allowNull: false,
        comment: 'Foreign key from Students table',
      },
      dependOnId: {
        type: Sequelize.INTEGER,
        field: 'fkDependOnId',
        allowNull: false,
        comment: 'Foreign key from DependOn table',
      },
      admissionInClass: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admissionType: {
        type: Sequelize.ENUM('school', 'academy', 'technical'),
        allowNull: false,
      },
      feeAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      commissionAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      admissionDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      admissionNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending',
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
