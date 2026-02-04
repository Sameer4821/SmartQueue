import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import QRCode from 'react-native-qrcode-svg'; 
 
 const COUNTER_KEY = '@token_counter';
 const PREFIX = 'GEN';
 const MAX_DIGITS = 4;  
 
 // Helper function to get a formatted time string (e.g., '143005' for 2:30:05 PM)
 const getFormattedTime = () => {
     const now = new Date();
     // Get hours (00-23), minutes (00-59), and seconds (00-59) and pad them to 2 digits
     const hours = String(now.getHours()).padStart(2, '0');
     const minutes = String(now.getMinutes()).padStart(2, '0');
     const seconds = String(now.getSeconds()).padStart(2, '0');
     // Combine them into the desired format
     return `${hours}${minutes}${seconds}`;
 };  
 
 const formatCounter = (counter) => {
   return String(counter).padStart(MAX_DIGITS, '0');
 }; 
 
 // Initial token with a placeholder time for consistency
 const initialToken = `${PREFIX}-${getFormattedTime()}-0000`;
 
 const tokenGenerator = () => {
   const [currentCounter, setCurrentCounter] = useState(0);
   const [currentToken, setCurrentToken] = useState(initialToken); // Use the new initial format
 
   useEffect(() => {
     const loadCounter = async () => {
      try {
         const value = await AsyncStorage.getItem(COUNTER_KEY);
         const savedCounter = value != null ? parseInt(value) : 0;
     
      setCurrentCounter(savedCounter);
            // Update the token on load with the current time and loaded counter
          setCurrentToken(`${PREFIX}-${getFormattedTime()}-${formatCounter(savedCounter)}`);
      } catch (e) {
         console.error("Failed to load counter from AsyncStorage:", e);
      } finally { 
 
  }
  }; 
 loadCounter();
  }, []); 
 
 
 const handleGenerateToken = async () => {
 // Get the time string *before* calculating the new counter and saving
     const timestamp = getFormattedTime();
 
  const newCounter = currentCounter + 1;
  const newCounterString = newCounter.toString();
  
 if (newCounterString.length > MAX_DIGITS) {
      alert("Counter limit reached (9999). Resetting to 1.");
  
      const resetCounter = 0;
      
 
      setCurrentCounter(resetCounter);
     // New token format with timestamp and reset counter
      setCurrentToken(`${PREFIX}-${timestamp}-${formatCounter(resetCounter)}`);
 
      try {
          await AsyncStorage.setItem(COUNTER_KEY, String(resetCounter));
      } catch (e) {
          console.error("Failed to save reset counter:", e);
      }
  } else {
   
      setCurrentCounter(newCounter);
     // New token format with timestamp and new counter
      setCurrentToken(`${PREFIX}-${timestamp}-${formatCounter(newCounter)}`);
      
   
      try {
          await AsyncStorage.setItem(COUNTER_KEY, String(newCounter));
      } catch (e) {
          console.error("Failed to save new counter:", e);
      }
  }
  
 };
 
  return (
    <View style={styles.container}>
   <Text style={styles.headerText}>Patient Token</Text>
   <Text style={styles.subText}>Patient_name: SPARTANS</Text>
   <Text style={styles.subText}>Patient_ph_no: 0123456789</Text>
   <Text style={styles.subText}>Department: Cardiology</Text>
   <TouchableOpacity 
    style={styles.button} 
    onPress={handleGenerateToken}
   >
    <Text style={styles.buttonText}>Generate Next Token</Text>
   </TouchableOpacity>
   
   <Text style={styles.subText}>
    Token ID:
   </Text>
   <Text style={styles.tokenDisplay}>
    {currentToken}
   </Text>
   
   {/* QR Code Rendering */}
   <View style={styles.qrContainer}>
    <QRCode
     value={currentToken} // The sequential token to be encoded
     size={220} 
     color="#000"
     backgroundColor="#fff"
    />
   </View>
  </View>
  );
 }; 
 
 const styles = StyleSheet.create({
  container: {
   alignItems: 'center',
   padding: 30,
   backgroundColor: '#f9f9f9',
   flex: 1,
  paddingTop: 50,
  }, 
  headerText: {
   fontSize: 28,
   fontWeight: 'bold',
   marginBottom: 30,
   color: '#333',
  },
  button: {
   top:550,
   backgroundColor: '#007AFF',
   paddingVertical: 14,
   paddingHorizontal: 30,
    borderRadius: 8,
   marginBottom: 40,
   elevation: 3,
  },
    buttonText: {
    color: 'white',
    fontSize: 18,
   fontWeight: 'bold',
  },
   subText: {
    fontWeight:'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  tokenDisplay: {
     fontSize: 32,
     fontWeight: '900',
     color: '#000',
     marginBottom: 30,
     padding: 10,
     backgroundColor: '#fff',
     borderRadius: 5,
     borderWidth: 1,
     borderColor: '#eee',
   },
    qrContainer: {
     padding: 15,
     backgroundColor: 'white',
     borderRadius: 10,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.1,
     shadowRadius: 5,
 elevation: 8,
  },
 }); 
 
 export default tokenGenerator;
 