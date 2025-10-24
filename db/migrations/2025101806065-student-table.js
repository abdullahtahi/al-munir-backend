'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      studentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      residentNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profileImg: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthCertificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      schoolLeavingCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherCnicImgFront: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherCnicImgBack: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE, // ✅ Use Sequelize.DATE (not Sequelize.Date)
        allowNull: false,
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherEducation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherOccupation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fatherCnic: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherEducation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherOccupation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motherCnic: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permanentAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secondaryAddress: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Students');
  },
};
