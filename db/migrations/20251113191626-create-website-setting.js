'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WebsiteSetting', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      vision: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone:{
        type:Sequelize.STRING,
        allowNull: false,
      }, 
      logo:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      facebookLink:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      youtubeLink:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      email:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      sucessStories:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      trustedTutors:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      schedule:{
        type:Sequelize.STRING,
        allowNull: true,
      },
      courses:{
        type:Sequelize.STRING,
        allowNull: true,
      },

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WebsiteSetting');
  },
};
