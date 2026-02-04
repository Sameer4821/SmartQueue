import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const BOOKINGS_DATA = [
  { id: 'EME-150214-003', name: 'John Doe', doctor: 'Dr. Smith', priority: 'Emergency' },
  { id: 'EME-170214-004', name: 'Alice Brown', doctor: 'Dr. Lee', priority: 'General' },
  { id: 'GEN-140214-001', name: 'Carol King', doctor: 'Dr. Jones', priority: 'Accessibility' },
  { id: 'GEN-180214-002', name: 'Bob Johnson', doctor: 'Dr. Lee', priority: 'Emergency' },
];

const priorityOrder = {
  Emergency: 1,
  General: 2,
  Accessibility: 3,
};

export default function StaffDashboard() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const sortedBookings = [...BOOKINGS_DATA].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const getColor = (priority) => {
    if (priority === 'Emergency') return '#ef4444';
    if (priority === 'General') return '#3b82f6';
    return '#22c55e';
  };

  const handleScan = ({ data }) => {
    setScannerVisible(false);
    try {
      setScannedData(JSON.parse(data));
    } catch {
      setScannedData({ raw: data });
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Camera permission is required
        </Text>
        <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
          <Text style={{ color: '#fff' }}>Grant Permission</Text>
        </TouchableOpacity> 
      </View> 
    );
  }

  return ( 
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Staff Dashboard</Text>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setScannerVisible(true)}
      >
        <Ionicons name="qr-code-outline" size={24} color="#fff" />
        <Text style={styles.scanText}>Scan QR</Text>
      </TouchableOpacity>

      {scannedData && (
        <View style={styles.scannedBox}>
          <Text style={styles.subtitle}>Scanned Data</Text>
          <Text>{JSON.stringify(scannedData, null, 2)}</Text>
        </View>
      )}

      <Text style={styles.subtitle}>Booked Patients</Text>
      <FlatList
        data={sortedBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: getColor(item.priority) }]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Token ID: {item.id}</Text>
            <Text>Doctor: {item.doctor}</Text>
            <Text style={{ color: getColor(item.priority), fontWeight: 'bold' }}>
              {item.priority}
            </Text>
           </View>
        )}
      />

      {/* Scanner Modal */}
      <Modal visible={scannerVisible} animationType="slide">
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleScan}
        />

        <TouchableOpacity

          style={styles.closeButton}
          onPress={() => setScannerVisible(false)}
        >
          <View style={styles.scannerOverlay}>
      <View style={styles.focusContainer}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      
    </View>
          <Text style={{ color: '#fff' }}>Close Scanner</Text>
        </TouchableOpacity> 
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ 
  container: {
    marginTop:35,
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  }, 
 
   subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
   },
 
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
   },

  scanText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },

  scannedBox: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

   card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 6,
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  }, 
 
  closeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
   },
   scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dimming
  },
  focusContainer: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#fff',
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 30, // Large radius for the "parentheses" look
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 30,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 30,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 30,
  },
  controlContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark circular background
    justifyContent: 'center',
    alignItems: 'center',
  }
}); 
 
 