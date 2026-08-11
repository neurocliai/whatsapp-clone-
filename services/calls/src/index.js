/** Calls microservice — WebRTC signaling over RTDB `calls/{sessionId}/signals`. */
export const serviceName = "calls";
export const supportedTypes = ["voice", "video", "screen"];
export const rtdbPaths = ["calls/{sessionId}/signals"];
