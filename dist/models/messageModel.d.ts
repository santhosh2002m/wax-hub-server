import { Model, Optional } from "sequelize";
interface MessageAttributes {
    id: number;
    message: string;
    counter_id: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface MessageCreationAttributes extends Optional<MessageAttributes, "id" | "createdAt" | "updatedAt"> {
}
declare class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    id: number;
    message: string;
    counter_id: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Message;
//# sourceMappingURL=messageModel.d.ts.map