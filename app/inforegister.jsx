import React, { useState, useMemo, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    ScrollView,
    Alert 
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; 
import debounce from 'lodash.debounce'; 
import { Link } from "expo-router";

const AI_API_ENDPOINT = "http://192.168.230.40:3000/api/triage"; 
const MIN_SYMPTOM_LENGTH = 8; 
const DEBOUNCE_DELAY_MS = 800; 


const AXIOS_CONFIG = {
    timeout: 10000 // 10 seconds
};

const TriageForm = () => {
    // Input States
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male'); 
    const [symptoms, setSymptoms] = useState('');
    
    // AI/Output States
    const [recommendedDepartment, setRecommendedDepartment] = useState('General Medicine');
    const [isLoading, setIsLoading] = useState(false);

    // List of departments used for Picker mapping
    const allDepartments = [
        { label: 'General Medicine', value: "General Medicine" },
        { label: 'Cardiology', value: "Cardiology" },
        { label: 'Orthopedics', value: "Orthopedics" },
        { label: 'Neurology', value: "Neurology" },
        { label: 'Pediatrics', value: "Pediatrics" },
        { label: 'Gynecology', value: "Gynecology" },
    ];

    // --- Core Analysis Function (Non-Debounced) ---
    const fetchDepartmentRecommendation = async (symptomText) => {
        if (symptomText.trim().length < MIN_SYMPTOM_LENGTH) {
            setRecommendedDepartment('General Medicine');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(AI_API_ENDPOINT, {
                symptom_text: symptomText
            }, AXIOS_CONFIG); // <-- Use the timeout config here
            
            // --- CRUCIAL CLIENT DEBUG LOG ---
            console.log("CLIENT DEBUG: AI Response Data:", response.data);
            // -------------------------------

            // Check if the expected key exists and is valid
            const resultDepartment = response.data.department_recommendation;

            if (typeof resultDepartment === 'string' && resultDepartment.length > 0) {
                 setRecommendedDepartment(resultDepartment);
            } else {
                 console.error("CLIENT DEBUG: Invalid response structure from server. Check server console for 500 error details.");
                 setRecommendedDepartment('General Medicine');
                 Alert.alert("Analysis Failed", "The server returned an empty or invalid department name.");
            }

        } catch (error) {
            // This catches network errors or 500 status codes from the server
            console.error("CLIENT DEBUG: Axios or Server Error:", error.message || error);
            
            let errorMessage = "Server not responding (Network Error).";
            
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                 errorMessage = "Request Timed Out (10s). AI call is taking too long or server is blocked.";
            } else if (error.response && error.response.status === 500) {
                 errorMessage = "Internal Server Error (500). Check your Gemini API key in the server terminal.";
            }
            
            Alert.alert("Triage Failed", errorMessage);
            setRecommendedDepartment('General Medicine');
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Debounced Function ---
    const debouncedAnalyze = useMemo(
        () => debounce(fetchDepartmentRecommendation, DEBOUNCE_DELAY_MS),
        [] 
    );

    // --- Change Handler ---
    const handleSymptomChange = (newText) => {
        setSymptoms(newText);
        debouncedAnalyze(newText); 
    };

    // Cleanup: Cancel pending calls
    useEffect(() => {
        return () => {
            debouncedAnalyze.cancel();
        };
    }, [debouncedAnalyze]);


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                
                <Text style={styles.headerText}>Multi-Department Token-Generation</Text>
                <Text style={styles.subHeaderText}>One token for all hospital services</Text>

                {/* Name, Age, Gender Inputs */}
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.textInput} placeholder="Enter Name" value={name} onChangeText={setName} />
                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.textInput} placeholder="Enter Age" keyboardType="numeric" value={age} onChangeText={setAge} />
                <Text style={styles.label}>Gender</Text>
                <TextInput style={styles.textInput} placeholder="Male/Female/Other" value={gender} onChangeText={setGender} />

                {/* --- SYMPTOMS TEXTAREA --- */}
                <Text style={styles.label}>Symptoms</Text>
                <TextInput
                    style={styles.textAreaInput}
                    multiline
                    numberOfLines={4}
                    value={symptoms}
                    onChangeText={handleSymptomChange} 
                    placeholder="Enter Your Symptoms"
                    placeholderTextColor="#999"
                    textAlignVertical="top"
                />
                
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#007AFF" size="small" />
                        <Text style={styles.loadingText}>Analyzing symptoms...</Text>
                    </View>
                )}
                
                {/* --- DEPARTMENT DROPDOWN (AI Output) --- */}
                <Text style={styles.label}>Select the department</Text>
                <View style={styles.pickerContainer}>
                    {/* Diagnostic Text: If this doesn't change, the response failed! */}
                    <Text style={styles.diagnosticText}>
                        AI Suggestion: {recommendedDepartment}
                    </Text>
                    
                    <Picker
                        // FIX: Key forces the component to re-mount/refresh
                        key={recommendedDepartment} 
                        
                        selectedValue={recommendedDepartment}
                        onValueChange={(itemValue) => setRecommendedDepartment(itemValue)} 
                        style={styles.picker}
                        enabled={!isLoading} 
                    >
                        {allDepartments.map((dept) => (
                            <Picker.Item 
                                key={dept.value} 
                                label={dept.label} 
                                value={dept.value} 
                            />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.scheduleButton} disabled={isLoading}>
                    <Link href = "/token" style={styles.scheduleButtonText}>CONTINUING SCHEDULE OPTIONS</Link>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
    container: { padding: 20, flex: 1 },
    headerText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10 },
    subHeaderText: { fontSize: 14, color: '#666', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#333' },
    textInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
    textAreaInput: { 
        borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, minHeight: 100, fontSize: 16, 
        backgroundColor: '#f9f9f9', paddingTop: 10,
    },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 15 },
    loadingText: { marginLeft: 10, color: '#007AFF' },
    pickerContainer: { 
        borderColor: '#ccc', borderWidth: 1, borderRadius: 5, overflow: 'hidden', 
        backgroundColor: '#f9f9f9', justifyContent: 'center',
        height: 100, // Adjusted height to accommodate text
    },
    diagnosticText: {
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#D32F2F', // Red for visibility
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    picker: { height: 50, width: '100%' },
    scheduleButton: { 
        backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center', 
        marginTop: 30, elevation: 3,
    },
    scheduleButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default TriageForm;