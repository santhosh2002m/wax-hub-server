import { Model, Optional } from "sequelize";
interface TicketAttributes {
    id: number;
    price: number;
    dropdown_name: string;
    show_name: string;
    counter_id?: number | null;
    is_analytics: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TicketCreationAttributes extends Optional<TicketAttributes, "id" | "createdAt" | "updatedAt" | "counter_id" | "is_analytics"> {
}
declare class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
    id: number;
    price: number;
    dropdown_name: string;
    show_name: string;
    counter_id?: number | null;
    is_analytics: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Ticket;
//# sourceMappingURL=ticketModel.d.ts.map