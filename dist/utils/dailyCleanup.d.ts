/**
 * Clean up user tickets and special tickets from previous days
 * This should be called daily at midnight
 */
export declare const cleanupOldTickets: () => Promise<{
    userTicketsDeleted: number;
    specialTicketsDeleted: number;
}>;
/**
 * Schedule daily cleanup at midnight
 */
export declare const scheduleDailyCleanup: () => void;
//# sourceMappingURL=dailyCleanup.d.ts.map