import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("user_tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoice_no: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      vehicle_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      guide_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      guide_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      show_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ticket_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      final_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("completed", "pending", "cancelled"),
        defaultValue: "completed",
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.dropTable("user_tickets");
  },
};
