import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TicketAttributes {
  id: number;
  price: number;
  ticket_type?: string;
  show_name?: string;
  category: "Adult" | "Child" | "Senior" | "Group" | "Other";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TicketCreationAttributes
  extends Optional<
    TicketAttributes,
    "id" | "createdAt" | "updatedAt" | "category"
  > {}

class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: number;
  public price!: number;
  public ticket_type?: string;
  public show_name?: string;
  public category!: "Adult" | "Child" | "Senior" | "Group" | "Other";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ticket_type: {
      type: DataTypes.STRING(100),
    },
    show_name: {
      type: DataTypes.STRING(100),
    },
    category: {
      type: DataTypes.ENUM("Adult", "Child", "Senior", "Group", "Other"),
      allowNull: false,
      defaultValue: "Other",
    },
  },
  {
    sequelize,
    modelName: "Ticket",
    tableName: "Tickets",
  }
);

export default Ticket;
