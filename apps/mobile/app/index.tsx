import { Link } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Opero</Text>
      <Text style={styles.tag}>Business operations Enterprise</Text>
      <Text style={styles.lead}>
        Realtime work messaging, calls, projects, and data connectors on iOS & Android.
      </Text>
      <Link href="/auth" asChild>
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </Link>
      <Link href="/home" asChild>
        <Pressable style={[styles.btn, styles.ghost]}>
          <Text style={styles.ghostText}>Enter demo workspace</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    backgroundColor: "#0B1220",
  },
  brand: {
    fontSize: 48,
    fontWeight: "800",
    color: "#E8EEF7",
    letterSpacing: -1,
  },
  tag: {
    marginTop: 8,
    color: "#1EC8A5",
    fontWeight: "700",
    fontSize: 16,
  },
  lead: {
    marginTop: 16,
    marginBottom: 28,
    color: "#9AA8BD",
    lineHeight: 22,
  },
  btn: {
    backgroundColor: "#1EC8A5",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: { color: "#04110d", fontWeight: "800" },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(232,238,247,0.12)",
  },
  ghostText: { color: "#E8EEF7", fontWeight: "700" },
});
