import assert from 'assert'
import fetch from 'isomorphic-fetch'
import { createClient } from 'graphql-sse'
 
const client = createClient({
  // singleConnection: true, use "single connection mode" instead of the default "distinct connection mode"
  url: 'http://localhost:4000/graphql/stream'
})
 
// query via http
;(async () => {
  const result = await fetch('http://localhost:4000/graphql', { 
    method: 'POST', 
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ query: '{ hello }' })
  })
 
  assert.deepStrictEqual(await result.json(), { data: { hello: 'world' } })
})()

// query
;(async () => {
  const result = await new Promise((resolve, reject) => {
    let result
    client.subscribe(
      {
        query: '{ hello }'
      },
      {
        next: data => (result = data),
        error: reject,
        complete: () => resolve(result)
      }
    )
  })
 
  assert.deepStrictEqual(result, { data: { hello: 'world' } })
})()
 
// subscription
;(async () => {
  let nextCalls = 0
  const onNext = () => {
    nextCalls++
  }
 
  let unsubscribe = () => {
    /* complete the subscription */
  }
 
  await new Promise((resolve, reject) => {
    unsubscribe = client.subscribe(
      {
        query: 'subscription { greetings }'
      },
      {
        next: onNext,
        error: reject,
        complete: resolve
      }
    )
  })
 
  assert.equal(nextCalls, 5) // we say "Hi" in 5 languages
})()
