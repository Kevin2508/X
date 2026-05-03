"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoutes_1 = __importDefault(require("./routes/tweetRoutes"));
const interactionRoutes_1 = __importDefault(require("./routes/interactionRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const verifyAuth_1 = require("./middleware/verifyAuth");
const userController_1 = require("./controllers/userController");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: `http://localhost:5173`,
    credentials: true
}));
app.use((0, express_session_1.default)({
    secret: "kevin", // Change this for production
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: "lax",
    }
}));
// ROUTES
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes_1.default);
database_1.default;
app.use("/api/users", userRoutes_1.default);
app.use("/api/tweets", tweetRoutes_1.default);
app.use("/api/interaction", interactionRoutes_1.default);
app.use("/api/comments", interactionRoutes_1.default);
app.use("/api/follows", followRoutes_1.default);
app.get("/api/feed", verifyAuth_1.verifyToken, userController_1.getUserFeed);
app.get("/", (req, res) => {
    res.send("Hello, TypeScript + Express!");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
