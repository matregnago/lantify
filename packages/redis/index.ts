import { redis } from 'bun'

// Set a key
await redis.set("greeting", "Hello from Bun!123123");

// Get a key
const greeting = await redis.get("greeting");
console.log(greeting); // "Hello from Bun!"