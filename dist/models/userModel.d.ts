import { Model, Optional } from "sequelize";
interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: "ticket_manager" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt" | "role"> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    username: string;
    password: string;
    role: "ticket_manager" | "admin";
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=userModel.d.ts.map