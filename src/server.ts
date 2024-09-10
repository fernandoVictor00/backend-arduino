import fastify from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = fastify();
const prisma = new PrismaClient();

app.get('/playlist', async (request, reply) => {
    const playlists = await prisma.playlists.findMany({
        include: {
            videos: true,
        },
    });
    return reply.send(playlists);
});

app.post('/video', async (request, reply) => {
    const createPlaylistSchema = z.object({
        src: z.string(),
        description: z.string()
    }); 
    const { src, description } = createPlaylistSchema.parse(request.body);
    const playlist = await prisma.playlists.create({
        data: {
            src, description
        },
    });
    return reply.send(playlist).status(201);    
});

app.listen({
    host: '0.0.0',
    port: process.env.PORT? Number(process.env.PORT) : 3333,
}).then(()=>{
    console.log('Server is running on port 3333');
})