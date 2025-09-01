"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = __importDefault(require("./config/database"));
const counterRoutes_1 = __importDefault(require("./routes/counterRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const guideRoutes_1 = __importDefault(require("./routes/guideRoutes")); // Add this import
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const userTicketRoutes_1 = __importDefault(require("./routes/userTicketRoutes"));
const userGuideRoutes_1 = __importDefault(require("./routes/userGuideRoutes"));
const specialTicketRoutes_1 = __importDefault(require("./routes/specialTicketRoutes"));
const userAuthRoutes_1 = __importDefault(require("./routes/userAuthRoutes"));
const counterController_1 = require("./controllers/counterController");
const twilioRoutes_1 = __importDefault(require("./routes/twilioRoutes"));
const dailyCleanup_1 = require("./utils/dailyCleanup");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/counters", counterRoutes_1.default);
app.use("/api/tickets", ticketRoutes_1.default);
app.use("/api/guides", guideRoutes_1.default); // Add this line to register /api/guides
app.use("/api/analytics", analyticsRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
app.use("/api/user/tickets", userTicketRoutes_1.default);
app.use("/api/user/guides", userGuideRoutes_1.default);
app.use("/api/special/tickets", specialTicketRoutes_1.default);
app.use("/api/user/auth", userAuthRoutes_1.default);
// Add this import
// Add this route registration (after other routes)
app.use("/api/twilio", twilioRoutes_1.default);
// Database sync and special counter creation
// FILE: app.ts (add this after database sync)
// Add this after database sync
database_1.default
    .sync({ alter: true })
    .then(async () => {
    console.log("Database synced");
    await (0, counterController_1.createSpecialCounter)(); // Create special counter on startup
    // Schedule daily cleanup
    (0, dailyCleanup_1.scheduleDailyCleanup)();
    // Also run cleanup on startup to clear any old tickets
    setTimeout(async () => {
        try {
            await (0, dailyCleanup_1.cleanupOldTickets)();
            console.log("Initial cleanup completed");
        }
        catch (error) {
            console.error("Initial cleanup failed:", error);
        }
    }, 5000); // Wait 5 seconds after startup
})
    .catch((err) => console.error("Database sync error:", err));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=app.js.map