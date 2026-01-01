import { redis } from "../config/redis.js";

export async function saveOtp(email, otp) {
  await redis.set(`otp:${email}`, otp, { EX: 300 });
}

export async function getOtp(email) {
  return await redis.get(`otp:${email}`);
}

export async function deleteOtp(email) {
  return await redis.del(`otp:${email}`);
}

// User

export async function saveTempUser(email, data) {
  await redis.set(`tempUser:${email}`, JSON.stringify(data));
}

export async function getTempUser(email) {
  const data = await redis.get(`tempUser:${email}`);
  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return data;
}

export async function deleteTempUser(email) {
  return await redis.del(`tempUser:${email}`);
}
