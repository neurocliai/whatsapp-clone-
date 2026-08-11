/**
 * Messaging microservice boundary.
 * Owns channel membership, message fan-out, and typing indicators.
 * Persistence: Firestore `messages`, RTDB `channels/{id}/typing`.
 */
export const serviceName = "messaging";
export const collections = ["channels", "messages"];
export const rtdbPaths = ["channels/{channelId}/typing"];
