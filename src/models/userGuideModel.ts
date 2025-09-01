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
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface UserGuideCreationAttributes
  extends Optional<
    UserGuideAttributes,
    | "id"
    | "score"
    | "total_bookings"
    | "rating"
    | "status"
    | "created_at"
    | "updated_at"
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
  public status!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserGuide.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false, unique: true },
    vehicle_type: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_bookings: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    status: { type: DataTypes.STRING, defaultValue: "active" },
    created_at: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
    updated_at: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
  },
  {
    sequelize,
    modelName: "UserGuide",
    tableName: "guides",
    timestamps: true,
    underscored: true,
  }
);

export default UserGuide;
