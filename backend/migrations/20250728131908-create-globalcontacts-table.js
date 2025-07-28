// migrations/XXXXXX-create-globalcontacts-table.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("globalcontacts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        defaultValue: "Unknown",
      },
      spamLikelihood: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalSpamReports: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      isRegistered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("globalcontacts");
  },
};
