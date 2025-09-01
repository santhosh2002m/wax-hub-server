import { Model, Optional } from "sequelize";
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
    status: "pending" | "completed" | "cancelled";
    user_id: number;
    counter_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserTicketCreationAttributes extends Optional<UserTicketAttributes, "id" | "createdAt" | "updatedAt" | "status" | "counter_id"> {
}
export declare class UserTicket extends Model<UserTicketAttributes, UserTicketCreationAttributes> implements UserTicketAttributes {
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
    status: "pending" | "completed" | "cancelled";
    user_id: number;
    counter_id?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default UserTicket;
//# sourceMappingURL=userticketModel.d.ts.map