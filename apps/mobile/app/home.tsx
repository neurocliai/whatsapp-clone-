import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { OPERO_FEATURES } from "@opero/types";

export default function HomeScreen() {
  const { email = "demo@opero.io", role = "user" } = useLocalSearchParams<{
    email?: string;
    role?: string;
  }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
      <Text style={styles.kicker}>{String(role).toUpperCase()} APP</Text>
      <Text style={styles.title}>Welcome, {String(email)}</Text>
      <Text style={styles.sub}>Realtime RTDB: https://opero-enterprise-default-rtdb.firebaseio.com</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Team coordination</Text>
        <Text style={styles.row}>Messages · Voice · Video · Screen share</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data platforms</Text>
        <Text style={styles.row}>Power BI · Snowflake · Dataflake · Big Data</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Capabilities</Text>
        {OPERO_FEATURES.map((f) => (
          <Text key={f.key} style={styles.feature}>
            • {f.label}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  kicker: { color: "#1EC8A5", fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  title: { color: "#E8EEF7", fontSize: 26, fontWeight: "800" },
  sub: { color: "#9AA8BD", marginTop: 8, marginBottom: 18 },
  card: {
    borderWidth: 1,
    borderColor: "rgba(232,238,247,0.12)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#141C2B",
  },
  cardTitle: { color: "#E8EEF7", fontWeight: "800", marginBottom: 8, fontSize: 16 },
  row: { color: "#9AA8BD", lineHeight: 20 },
  feature: { color: "#C9D4E5", marginBottom: 4 },
});
