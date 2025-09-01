import { Model, Optional } from "sequelize";
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
interface UserGuideCreationAttributes extends Optional<UserGuideAttributes, "id" | "score" | "total_bookings" | "rating" | "status" | "created_at" | "updated_at"> {
}
declare class UserGuide extends Model<UserGuideAttributes, UserGuideCreationAttributes> implements UserGuideAttributes {
    id: number;
    name: string;
    number: string;
    vehicle_type: string;
    score: number;
    total_bookings: number;
    rating: number;
    status: string;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default UserGuide;
//# sourceMappingURL=userGuideModel.d.ts.map