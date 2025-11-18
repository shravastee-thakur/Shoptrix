import { redis } from "./redis.js";

export async function saveResetToken(userId, hashedToken) {
  await redis.set(`reset:${userId}`, hashedToken, { EX: 300 });
}

export async function getResetToken(userId) {
  return await redis.get(`reset:${userId}`);
}

export async function deleteResetToken(userId) {
  await redis.del(`reset:${userId}`);
}
