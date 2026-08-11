import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  onValue,
  update,
  push,
  type Database,
} from "firebase/database";
import { getPublicEnv, isFirebaseConfigured } from "@opero/config";
import type { ChatMessage, OperoUser, PresenceStatus, UserRole } from "@opero/types";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let rtdb: Database | undefined;

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return undefined;
  }
  if (!app) {
    const env = getPublicEnv();
    app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: env.apiKey,
          authDomain: env.authDomain,
          projectId: env.projectId,
          storageBucket: env.storageBucket,
          messagingSenderId: env.messagingSenderId,
          appId: env.appId,
          databaseURL: env.databaseURL,
          measurementId: env.measurementId || undefined,
        });
  }
  return app;
}

export function getFirebaseAuth() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export function getFirestoreDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

export function getRealtimeDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!rtdb) rtdb = getDatabase(firebaseApp);
  return rtdb;
}

export { isFirebaseConfigured };

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

async function upsertUserProfile(user: User, role: UserRole = "user") {
  const firestore = getFirestoreDb();
  if (!firestore) return;
  const refDoc = doc(firestore, "users", user.uid);
  const existing = await getDoc(refDoc);
  if (existing.exists()) {
    await setDoc(
      refDoc,
      {
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "Opero User",
        photoURL: user.photoURL || "",
        lastActiveAt: Date.now(),
      },
      { merge: true }
    );
    return existing.data() as OperoUser;
  }
  const profile: OperoUser = {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || user.email?.split("@")[0] || "Opero User",
    photoURL: user.photoURL || undefined,
    role,
    orgId: "opero-default",
    department: "Operations",
    title: role === "admin" ? "Administrator" : "Team Member",
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  await setDoc(refDoc, profile);
  return profile;
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured. Add keys to .env.local");
  const cred = await createUserWithEmailAndPassword(a, email, password);
  await updateProfile(cred.user, { displayName });
  await upsertUserProfile(cred.user, "user");
  return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured. Add keys to .env.local");
  const cred = await signInWithEmailAndPassword(a, email, password);
  await upsertUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured. Add keys to .env.local");
  const cred = await signInWithPopup(a, googleProvider);
  await upsertUserProfile(cred.user);
  return cred.user;
}

export async function logout() {
  const a = getFirebaseAuth();
  if (!a) return;
  await signOut(a);
}

export function watchAuth(callback: (user: User | null) => void) {
  const a = getFirebaseAuth();
  if (!a) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(a, callback);
}

export async function getUserProfile(uid: string): Promise<OperoUser | null> {
  const firestore = getFirestoreDb();
  if (!firestore) return null;
  const snap = await getDoc(doc(firestore, "users", uid));
  return snap.exists() ? (snap.data() as OperoUser) : null;
}

export async function setPresence(uid: string, status: PresenceStatus) {
  const database = getRealtimeDb();
  if (!database) return;
  const statusRef = ref(database, `presence/${uid}`);
  await set(statusRef, { status, updatedAt: Date.now() });
  onDisconnect(statusRef).set({ status: "offline", updatedAt: Date.now() });
}

export function watchPresence(uid: string, callback: (status: PresenceStatus) => void) {
  const database = getRealtimeDb();
  if (!database) {
    callback("offline");
    return () => undefined;
  }
  const statusRef = ref(database, `presence/${uid}`);
  return onValue(statusRef, (snap) => {
    callback((snap.val()?.status as PresenceStatus) || "offline");
  });
}

export function watchChannelMessages(channelId: string, callback: (messages: ChatMessage[]) => void) {
  const firestore = getFirestoreDb();
  if (!firestore) {
    callback([]);
    return () => undefined;
  }
  const q = query(
    collection(firestore, "messages"),
    where("channelId", "==", channelId),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, "id">) })));
  });
}

export async function sendChannelMessage(
  channelId: string,
  senderId: string,
  senderName: string,
  text: string
) {
  const firestore = getFirestoreDb();
  if (!firestore) throw new Error("Firestore unavailable");
  await addDoc(collection(firestore, "messages"), {
    channelId,
    senderId,
    senderName,
    text,
    createdAt: Date.now(),
    serverCreatedAt: serverTimestamp(),
  });
  const database = getRealtimeDb();
  if (database) {
    await update(ref(database, `channels/${channelId}/typing`), { [senderId]: null });
  }
}

export async function setTyping(channelId: string, uid: string, isTyping: boolean) {
  const database = getRealtimeDb();
  if (!database) return;
  await update(ref(database, `channels/${channelId}/typing`), {
    [uid]: isTyping ? Date.now() : null,
  });
}

export async function createCallSignal(sessionId: string, payload: Record<string, unknown>) {
  const database = getRealtimeDb();
  if (!database) return;
  await push(ref(database, `calls/${sessionId}/signals`), {
    ...payload,
    createdAt: Date.now(),
  });
}

export { GoogleAuthProvider, onAuthStateChanged, serverTimestamp };
