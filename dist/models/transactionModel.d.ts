import { Model, Optional } from "sequelize";
interface TransactionAttributes {
    id: number;
    invoice_no: string;
    date: Date;
    adult_count: number;
    child_count: number;
    category: string;
    total_paid: number;
    ticket_id: number;
    counter_id: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "createdAt" | "updatedAt" | "counter_id"> {
}
declare class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
    id: number;
    invoice_no: string;
    date: Date;
    adult_count: number;
    child_count: number;
    category: string;
    total_paid: number;
    ticket_id: number;
    counter_id: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Transaction;
//# sourceMappingURL=transactionModel.d.ts.map