# graphql-see-mercurius

Example showing how to use graphql-sse with Mercurius on Vercel.

It builds on top of https://www.the-guild.dev/blog/graphql-over-sse#with-fastify and adds mercurius to the picture, with minor adaptations.

## Requirements

- Node LTS

## Setup

- `npm i`
- `node server.js`

In a different terminal window run:

- `node client.js`

This will check that queries and subscriptions work over plain HTTP (mercurius) and SSE (graphql-sse)

## How it works

- Exposes the same schema both via mercurius and graphql-see
- Mercurius listens on path `/graphql` whereas graphql-see on `/graphql-stream`
- Any GraphQL operations can go to either one or the other
- [Fastify serverless configuration](https://fastify.dev/docs/v4.15.x/Guides/Serverless/#vercel) is used to deploy to Vercel
