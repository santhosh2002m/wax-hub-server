// migrations/20240826-create-transaction.ts
import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoice_no: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      adult_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      total_paid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        references: { model: "Tickets", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      counter_id: {
        type: Sequelize.INTEGER,
        references: { model: "counters", key: "id" },
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
    await queryInterface.dropTable("Transactions");
  },
};
