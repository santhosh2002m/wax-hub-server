import {
  DataTypes,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import Ticket from "./ticketModel";
import Counter from "./counterModel";

interface TransactionAttributes {
  id: number;
  invoice_no?: string;
  date: Date;
  adult_count: number;
  child_count: number;
  category: "Adult" | "Child" | "Senior" | "Group" | "Other";
  total_paid: number;
  ticket_id?: number | null;
  counter_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCreationAttributes
  extends Optional<
    TransactionAttributes,
    "id" | "createdAt" | "updatedAt" | "child_count" | "category"
  > {}

interface TransactionWithAssociations extends TransactionAttributes {
  ticket?: Ticket;
  counter?: Counter;
}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionWithAssociations
{
  public id!: number;
  public invoice_no?: string;
  public date!: Date;
  public adult_count!: number;
  public child_count!: number;
  public category!: "Adult" | "Child" | "Senior" | "Group" | "Other";
  public total_paid!: number;
  public ticket_id?: number | null;
  public counter_id?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public getTicket!: BelongsToGetAssociationMixin<Ticket>;
  public getCounter!: BelongsToGetAssociationMixin<Counter>;
  public ticket?: Ticket;
  public counter?: Counter;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_no: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    adult_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    child_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Adult", "Child", "Senior", "Group", "Other"),
      allowNull: false,
      defaultValue: "Other",
    },
    total_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null
      references: { model: Ticket, key: "id" },
    },
    counter_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null
      references: { model: Counter, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "Transactions",
  }
);

Transaction.belongsTo(Ticket, { foreignKey: "ticket_id", as: "ticket" });
Transaction.belongsTo(Counter, { foreignKey: "counter_id", as: "counter" });

export default Transaction;
