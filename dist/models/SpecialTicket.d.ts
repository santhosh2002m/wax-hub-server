import { Model, Optional, Association } from "sequelize";
import Counter from "./counterModel";
interface SpecialTicketAttributes {
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
    counter_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SpecialTicketCreationAttributes extends Optional<SpecialTicketAttributes, "id" | "createdAt" | "updatedAt" | "status"> {
}
interface SpecialTicketAssociations {
    counter?: Counter;
}
export declare class SpecialTicket extends Model<SpecialTicketAttributes, SpecialTicketCreationAttributes> implements SpecialTicketAttributes, SpecialTicketAssociations {
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
    counter_id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    counter?: Counter;
    static associations: {
        counter: Association<SpecialTicket, Counter>;
    };
}
export default SpecialTicket;
//# sourceMappingURL=SpecialTicket.d.ts.map