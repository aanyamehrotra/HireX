import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

// Only initialize Stream clients if API keys are provided
let chatClient = null;
let streamClient = null;

if (!apiKey || !apiSecret) {
  console.warn("⚠️  STREAM_API_KEY or STREAM_API_SECRET is missing - video calls and chat disabled");
} else {
  chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used for chat features
  streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls
  console.log("✅ Stream clients initialized");
}

export { chatClient, streamClient };

export const upsertStreamUser = async (userData) => {
  if (!chatClient) {
    console.warn("Stream not configured - skipping user upsert");
    return;
  }
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully:", userData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  if (!chatClient) {
    console.warn("Stream not configured - skipping user deletion");
    return;
  }
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
};
