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
      consultantId: {
        type: Sequelize.INTEGER,
        field: 'fkConsultantId',
        allowNull: true,
        comment: 'Foreign key from Consultant table',
      },
      fromConsultantId: {
        type: Sequelize.INTEGER,
        field: 'fkFromConsultantId',
        allowNull: true,
        comment: 'Foreign key from Consultant table',
      
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      percentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      baseAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      levelDepth: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fkAdmissionId: {
        type: Sequelize.INTEGER,
        field: 'fkAdmissionId',
        allowNull: true,
        comment: 'Foreign key from Admission table',
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
    await queryInterface.addConstraint('Bonuses', {
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

    await queryInterface.addConstraint('Bonuses', {
      fields: ['fkFromConsultantId'],
      type: 'foreign key',
      name: 'bonuses_fk2',
      references: {
        table: 'Consultant',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    
    await queryInterface.addConstraint('Bonuses', {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bonuses');
  },
};
