'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
      },
      studentName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      residentNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profileImg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      schoolLeavingCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherCnicImgFront: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherCnicImgBack: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE, // ✅ Use Sequelize.DATE (not Sequelize.Date)
        allowNull: true,
      },
      fatherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherEducation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherOccupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fatherCnic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherEducation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherOccupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherCnic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      permanentAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      secondaryAddress: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  },
};
