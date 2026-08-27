import { messagingApi } from "@line/bot-sdk";

export const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET ?? "";

export const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",
});
