import {
  DataTypes,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../config/database";
import Counter from "./counterModel";

interface MessageAttributes {
  id: number;
  phone: string;
  message: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  counter_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    "id" | "createdAt" | "updatedAt" | "sentAt" | "counter_id"
  > {}

interface MessageWithAssociations extends MessageAttributes {
  counter?: Counter;
}

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageWithAssociations
{
  public id!: number;
  public phone!: string;
  public message!: string;
  public status!: "pending" | "sent" | "failed";
  public sentAt?: Date;
  public counter_id?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public counter?: Counter;
  public getCounter!: BelongsToGetAssociationMixin<Counter>;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "sent", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    counter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Counter, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "Messages",
    timestamps: true,
    underscored: false,
  }
);

Message.belongsTo(Counter, { foreignKey: "counter_id", as: "counter" });

export default Message;
