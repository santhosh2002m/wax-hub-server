import { Model, Optional } from "sequelize";
interface CounterAttributes {
    id: number;
    username: string;
    password: string;
    role: "manager" | "admin" | "user";
    special: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CounterCreationAttributes extends Optional<CounterAttributes, "id" | "createdAt" | "updatedAt" | "role" | "special"> {
}
declare class Counter extends Model<CounterAttributes, CounterCreationAttributes> implements CounterAttributes {
    id: number;
    username: string;
    password: string;
    role: "manager" | "admin" | "user";
    special: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Counter;
//# sourceMappingURL=counterModel.d.ts.map