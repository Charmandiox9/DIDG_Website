"use server";
import { getBotStatus } from "@/core/lib/telegram";

export async function checkBotStatus() {
  return await getBotStatus();
}