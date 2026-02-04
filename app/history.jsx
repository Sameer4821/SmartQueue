import React from "react";
import { Icon, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from 'lucide-react-native'; 
import { useRouter, Link } from 'expo-router'; 
const sampleHistory = [
  {
    type: "general",
    time: "10:45 AM",
    timestamp: "104512",
    queue: "0001",
    date: "2025-11-28",
  },
  {
    type: "emergency",
    time: "ANYTIME",
    timestamp: "141502",
    queue: "0002",
    date: "2025-11-28",
  },
  {
    type: "accessibility",
    time: "08:30 AM",
    timestamp: "083025",
    queue: "0001",
    date: "2025-11-28",
  },
];

// ============================
// MAIN COMPONENT
// ============================

export default function PatientHistoryScreen({ route }) {
  // Patient data from login page (your friend will pass this)
  const patient = route?.params?.patient || {
    name: "SPARTANS",
    phone: "1234567890",
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}

      <View style={{ marginBottom: 15, marginTop: 10 }}>
          <TouchableOpacity  style={styles.backButtonContainer}
          onPress={() => router.push("/")}>          
           <ArrowLeft size={20} color="#000000" />
           </TouchableOpacity>
      </View>
       <View style={styles.headerBox}>
        <Text style={styles.title}>Patient History</Text>
        <Text style={styles.subtitle}>View your complete token history</Text>

        <View style={styles.profileBox}>
          <Text style={styles.profileIcon}>👤</Text>
          <View>
            <Text style={styles.name}>{patient.name}</Text>
            <Text style={styles.phone}>{patient.phone}</Text>
          </View>
        </View>
      </View>
      {/* History List */}
      <View style={{ marginTop: 20 }}>
        {sampleHistory.map((item, index) => (
          <HistoryCard key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

// ============================
// CARD COMPONENT
// ============================

function HistoryCard({ item }) {
  const bgColor =
    item.type === "general"
      ? "#dbeafe" // blue
      : item.type === "emergency"
      ? "#fee2e2" // red
      : "#a7d6a7ff"; // green

  const borderColor =
    item.type === "general"
      ? "#1d4ed8"
      : item.type === "emergency"
      ? "#dc2626"
      : "#226e30ff";

  const label =
    item.type === "general"
      ? "General Consultation"
      : item.type === "emergency"
      ? "Emergency Service"
      : "Accessibility Service";

  const prefix =
    item.type === "general"
      ? "GEN"
      : item.type === "emergency"
      ? "EME"
      : "ACE";

  const token = `${prefix}-${item.timestamp}-${item.queue}`;

  return (
    <View style={[styles.card, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      <Text style={[styles.label, { color: borderColor }]}>{label}</Text>

      <Text style={styles.token}>Token: {token}</Text>
      <Text style={styles.details}>Booked Time: {item.time}</Text>
      <Text style={styles.details}>Date: {item.date}</Text>
    </View>
  );
}

// ============================
// STYLES
// ============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 15,
  },

  headerBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: 5,
  },

  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 10,
  },

  profileIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  phone: {
    color: "#64748b",
    marginTop: 3,
  },

  card: {
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 5,
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 5,
  },

  token: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 4,
  },

  details: {
    fontSize: 14,
    marginTop: 3,
    color: "#475569",
  },
});