'use strict';
const bcrypt = require('bcryptjs');
const saltRounds = 12;
const password = bcrypt.hashSync('1234', saltRounds);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Consultant', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      referralCode: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      cnic: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: 'Pakistan',
      },
      role: {
        type: Sequelize.ENUM(
          'super_admin',
          'admin',
          'manager',
          'senior_manager',
          'area_manager',
          'sector_head',
          'user'
        ),
        defaultValue: 'user',
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 4,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended', 'pending'),
        defaultValue: 'pending',
        allowNull: false,
      },
      sponsorId: {
        type: Sequelize.INTEGER,
        field: 'fkSponsorId', // This defines the actual column name in database
        allowNull: true,
        defaultValue: null,
        comment: 'foreign key from Consultant table',
        validate: {
          notEmpty: {
            args: true,
            msg: 'sponsor is required.',
          },
        },
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: true,
      },
      totalAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      totalBonuses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      totalEarnings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      availableBalance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      withdrawnAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      bankId: {
        type: Sequelize.INTEGER,
        field: 'fkBankId',
        allowNull: true,
        defaultValue: null,
        comment: 'foreign key from Bank table',
        validate: {
          notEmpty: {
            args: true,
            msg: 'Bank is required.',
          },
        },
      },
      registrationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      schoolAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      academyAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      technicalAdmissions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      completionRate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      notificationPreferences: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      profile: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      paymentReceipt: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
    });

    await queryInterface.addConstraint('Consultant', {
      type: 'foreign key',
      fields: ['fkSponsorId'],
      name: 'Consultant_fk1',
      references: {
        table: 'Consultant',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('Consultant', {
      type: 'foreign key',
      fields: ['fkBankId'],
      name: 'Consultant_fk2',
      references: {
        table: 'Banks',
        field: 'id',
      },
    });

    await queryInterface.bulkInsert('Consultant', [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@gmail.com',
        password: password,
        cnic: '123',
        dateOfBirth: new Date(),
        role: 'super_admin',
        level: 1,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        fkBankId: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Consultant');
  },
};
