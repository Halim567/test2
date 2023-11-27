import Fastify, { type FastifyRequest } from 'fastify';
import OpenAi from 'openai';

interface BodySchema {
    message: string;
}

const openai = new OpenAi({ apiKey: process.env.API_KEY });
let message: string | null;

const app = Fastify()
    .get('/', (_, rep) => rep.code(200).send({ message: message || "Tidak ada pesan" }))
    .post('/', async (req: FastifyRequest<{ Body: BodySchema }>, rep) => {
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
        } catch(err) {
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

export default app;