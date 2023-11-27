"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: process.env.API_KEY });
let message;
const app = (0, fastify_1.default)()
    .get('/', (_, rep) => rep.code(200).send({ message: message || "Tidak ada pesan" }))
    .post('/', async (req, rep) => {
    if (typeof req.body.message !== 'string') {
        return rep.code(400).send({ message: 'Harus berupa data string' });
    }
    try {
        const res = await openai
            .chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: req.body.message
                }
            ]
        });
        message = res.choices[0].message.content;
        return rep.code(200).send({ message: 'Berhasil mengirim pesan' });
    }
    catch (err) {
        return rep.code(500).send({ message: err });
    }
})
    .listen({ port: 3000 }, (err, add) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server berjalan pada ${add}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map