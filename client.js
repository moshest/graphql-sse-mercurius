import assert from "assert";
import fetch from "isomorphic-fetch";
import { createClient } from "graphql-sse";

const client = createClient({
  // singleConnection: true, use "single connection mode" instead of the default "distinct connection mode"
  url: "https://graphql-sse-mercurius.vercel.app/graphql/stream",
});

// query via http
const queryViaHTTP = async () => {
  console.info("querying via HTTP");

  const result = await fetch(
    "https://graphql-sse-mercurius.vercel.app/graphql",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ query: "{ hello }" }),
    }
  );

  assert.deepStrictEqual(await result.json(), { data: { hello: "world" } });
};

// query
const query = async () => {
  console.info("querying via SSE");

  const result = await new Promise((resolve, reject) => {
    const result = [];

    client.subscribe(
      {
        query: "{ hello }",
      },
      {
        next: (data) => {
          console.info("received", data);
          result.push(data);
        },
        error: reject,
        complete: () => resolve(result),
      }
    );
  });

  assert.deepStrictEqual(result, [{ data: { hello: "world" } }]);
};

// subscription
const subscription = async () => {
  const result = [];

  const onNext = (data) => {
    console.info("received", data);
    result.push(data);
  };

  let unsubscribe = () => {
    /* complete the subscription */
  };

  await new Promise((resolve, reject) => {
    unsubscribe = client.subscribe(
      {
        query: "subscription { greetings }",
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      }
    );
  });

  assert.deepStrictEqual(result, [
    { data: { greetings: "Hi" } },
    { data: { greetings: "Bonjour" } },
    { data: { greetings: "Hola" } },
    { data: { greetings: "Ciao" } },
    { data: { greetings: "Zdravo" } },
  ]); // we say "Hi" in 5 languages
};

(async () => {
  await queryViaHTTP();
  await query();
  await subscription();
})();
