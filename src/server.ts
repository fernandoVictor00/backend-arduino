import fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = fastify();
const prisma = new PrismaClient();

app.register(cors, {
    origin: true, 
});

app.get('/playlist', async (request, reply) => {
    const playlists = await prisma.playlists.findMany({});
    return reply.send(playlists);
});

import { FastifyRequest, FastifyReply } from 'fastify';

interface PlaylistParams {
    id: string;
}

app.get('/playlist/:id', async (request: FastifyRequest<{ Params: PlaylistParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const playlist = await prisma.playlists.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            videos: true,
        },
    });
    if (playlist) {
        return reply.send(playlist);
    } else {
        return reply.status(404).send({ message: 'Playlist not found' });
    }
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
});