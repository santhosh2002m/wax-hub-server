import { Model, Optional } from "sequelize";
interface GuideAttributes {
    id: number;
    name: string;
    number?: string;
    vehicle_type?: string;
    score: number;
    createdAt?: Date;
    updatedAt?: Date;
}
interface GuideCreationAttributes extends Optional<GuideAttributes, "id" | "createdAt" | "updatedAt"> {
}
declare class Guide extends Model<GuideAttributes, GuideCreationAttributes> implements GuideAttributes {
    id: number;
    name: string;
    number?: string;
    vehicle_type?: string;
    score: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Guide;
//# sourceMappingURL=guideModel.d.ts.map