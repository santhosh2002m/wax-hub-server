import { Model, Optional } from "sequelize";
interface TwilioMessageAttributes {
    id: number;
    message_sid: string;
    to: string;
    from: string;
    body: string;
    status: string;
    direction: "outbound-api" | "inbound";
    price?: string | null;
    price_unit?: string | null;
    error_code?: string | null;
    error_message?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface TwilioMessageCreationAttributes extends Optional<TwilioMessageAttributes, "id" | "price" | "price_unit" | "error_code" | "error_message" | "createdAt" | "updatedAt"> {
}
declare class TwilioMessage extends Model<TwilioMessageAttributes, TwilioMessageCreationAttributes> implements TwilioMessageAttributes {
    id: number;
    message_sid: string;
    to: string;
    from: string;
    body: string;
    status: string;
    direction: "outbound-api" | "inbound";
    price?: string | null;
    price_unit?: string | null;
    error_code?: string | null;
    error_message?: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default TwilioMessage;
//# sourceMappingURL=twilioMessageModel.d.ts.map