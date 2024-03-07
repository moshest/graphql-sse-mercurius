import Fastify from "fastify";
import { createHandler } from "graphql-sse";
import mercurius from "mercurius";

import { schema } from "./schema.js";

// Create the GraphQL over SSE handler
const handler = createHandler({ schema });

const fastify = Fastify();

// Expose schema over plain mercurius
fastify.register(mercurius, {
  schema,
  graphiql: true,
});

// Delegate all requests to this path to graphql-sse
fastify.all("/graphql/stream", (req, res) =>
  handler(
    req.raw,
    res.raw,
    req.body // fastify reads the body for you
  )
);

// await fastify.listen({ port: 4000 })
// console.log('Listening to port 4000')

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
