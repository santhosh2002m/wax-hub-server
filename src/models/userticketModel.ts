import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserTicketAttributes {
  id: number;
  invoice_no: string;
  vehicle_type: string;
  guide_name: string;
  guide_number: string;
  show_name: string;
  adults: number;
  ticket_price: number;
  total_price: number;
  tax: number;
  final_amount: number;
  status: "completed" | "pending" | "cancelled";
  user_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserTicketCreationAttributes
  extends Optional<
    UserTicketAttributes,
    "id" | "createdAt" | "updatedAt" | "status" | "user_id"
  > {}

class UserTicket
  extends Model<UserTicketAttributes, UserTicketCreationAttributes>
  implements UserTicketAttributes
{
  public id!: number;
  public invoice_no!: string;
  public vehicle_type!: string;
  public guide_name!: string;
  public guide_number!: string;
  public show_name!: string;
  public adults!: number;
  public ticket_price!: number;
  public total_price!: number;
  public tax!: number;
  public final_amount!: number;
  public status!: "completed" | "pending" | "cancelled";
  public user_id?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserTicket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_no: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    guide_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    guide_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    show_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ticket_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "cancelled"),
      defaultValue: "completed",
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "UserTicket",
    tableName: "user_tickets",
    timestamps: true,
    underscored: false,
  }
);

export default UserTicket;
