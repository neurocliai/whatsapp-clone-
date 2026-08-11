import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to Opero</Text>
      <Text style={styles.sub}>Email/password or continue in demo mode. Wire EXPO_PUBLIC_FIREBASE_* keys for live Auth.</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Work email"
        placeholderTextColor="#9AA8BD"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#9AA8BD"
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={styles.btn}
        onPress={() =>
          router.replace({
            pathname: "/home",
            params: { email: email || "demo@opero.io", role: email.includes("admin") ? "admin" : "user" },
          })
        }
      >
        <Text style={styles.btnText}>Continue</Text>
      </Pressable>
      <Link href="/" style={{ marginTop: 16, color: "#9AA8BD" }}>
        Back
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#0B1220" },
  title: { color: "#E8EEF7", fontSize: 28, fontWeight: "800", marginBottom: 8 },
  sub: { color: "#9AA8BD", marginBottom: 20, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(232,238,247,0.12)",
    borderRadius: 14,
    padding: 14,
    color: "#E8EEF7",
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#1EC8A5",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  btnText: { color: "#04110d", fontWeight: "800" },
});
