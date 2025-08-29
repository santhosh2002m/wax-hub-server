import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface UserGuideAttributes {
  id: number;
  name: string;
  number: string;
  vehicle_type: string;
  score: number;
  total_bookings: number;
  rating: number;
  status: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
}

export interface UserGuideCreationAttributes
  extends Optional<
    UserGuideAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "score"
    | "total_bookings"
    | "rating"
    | "status"
  > {}

class UserGuide
  extends Model<UserGuideAttributes, UserGuideCreationAttributes>
  implements UserGuideAttributes
{
  public id!: number;
  public name!: string;
  public number!: string;
  public vehicle_type!: string;
  public score!: number;
  public total_bookings!: number;
  public rating!: number;
  public status!: "active" | "inactive";
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserGuide.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0.0,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserGuide",
    tableName: "user_guides",
    timestamps: true,
    underscored: true,
  }
);

export default UserGuide;
