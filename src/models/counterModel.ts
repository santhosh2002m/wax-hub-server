// src/models/counterModel.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CounterAttributes {
  id: number;
  username: string;
  password: string;
  role: "manager" | "admin"; // New role field
  createdAt?: Date; // Changed to camelCase
  updatedAt?: Date; // Changed to camelCase
}

// Export the interface
export interface CounterCreationAttributes
  extends Optional<
    CounterAttributes,
    "id" | "createdAt" | "updatedAt" | "role"
  > {}

class Counter
  extends Model<CounterAttributes, CounterCreationAttributes>
  implements CounterAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: "manager" | "admin";
  public readonly createdAt!: Date; // Changed to camelCase
  public readonly updatedAt!: Date; // Changed to camelCase
}

Counter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("manager", "admin"),
      defaultValue: "manager", // Default to manager
      allowNull: false,
    },
    createdAt: {
      // Changed to camelCase
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      // Changed to camelCase
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Counter",
    tableName: "counters",
    timestamps: true, // Enable timestamps
    underscored: false, // Disable underscored column names
  }
);

export default Counter;
