"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post('/ask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { question } = req.body;
    try {
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: question }],
        });
        const answer = (_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : 'No answer';
        res.json({ answer });
    }
    catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ answer: 'Error fetching AI response' });
    }
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
