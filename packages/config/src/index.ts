export const brand = {
  name: "Opero",
  tagline: "Business operations Enterprise",
  colors: {
    ink: "#0B1220",
    slate: "#141C2B",
    mist: "#E8EEF7",
    teal: "#1EC8A5",
    tealDeep: "#0F8F78",
    amber: "#F0A202",
    coral: "#E85D4C",
    line: "rgba(232, 238, 247, 0.12)",
  },
} as const;

export function getPublicEnv() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "opero-enterprise.firebaseapp.com",
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
      "opero-enterprise",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "opero-enterprise.appspot.com",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
    databaseURL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
      "https://opero-enterprise-default-rtdb.firebaseio.com",
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
      "",
    landingUrl: process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000",
    userAppUrl: process.env.NEXT_PUBLIC_USER_APP_URL || "http://localhost:3001",
    adminAppUrl: process.env.NEXT_PUBLIC_ADMIN_APP_URL || "http://localhost:3002",
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000",
  };
}

export function isFirebaseConfigured() {
  const env = getPublicEnv();
  return Boolean(env.apiKey && env.appId && env.projectId && env.databaseURL);
}
