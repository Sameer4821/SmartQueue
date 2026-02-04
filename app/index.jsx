import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; 
import {Link} from 'expo-router'
import { Picker } from '@react-native-picker/picker';
import { Image } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { all } from 'axios';
import Logo from '../assets/icon.png';


// ===============================================
// 1. TOKEN GENERATION UTILITY (SESSION-BASED SEQUENCING)
//    - Ensures token numbers (0001, 0002, ...) increment correctly per prefix.

const tokenCounters = {
    GEN: 0, 
    EME: 0, 
    ACE: 0, 
};
const MAX_DIGITS = 4;

// Helper function to get a formatted time string (e.g., '104738' for 10:47:38 AM)
const getFormattedTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
};

const formatCounter = (counter) => {
    return String(counter).padStart(MAX_DIGITS, '0');
};

const generateTokenID = (prefix) => {
    // 1. Increment the counter for the specific prefix
    tokenCounters[prefix] += 1;
    
    // 2. Format the components
    const timestamp = getFormattedTime();
    const sequence = formatCounter(tokenCounters[prefix]);
    
    // 3. Assemble the final ID
    return `${prefix}-${timestamp}-${sequence}`;
};


// ===============================================
// 2. HELPER COMPONENTS
// ===============================================

const ServiceBox = ({ icon, title, subtitle, queue, color, onBook }) => (
    <View style={[styles.serviceBox, { borderLeftColor: color }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={icon} size={28} color={color} style={{ marginRight: 15 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>{title}</Text>
                <Text style={styles.serviceSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.queueContainer}>
                <Text style={styles.queueLabel}>Queue: </Text>
                <Text style={styles.queueCount}>{queue}</Text>
            </View>
        </View>
        <TouchableOpacity 
            style={[styles.bookButton, { backgroundColor: color }]} 
            onPress={onBook} 
        >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
    </View>
);

const StepIndicatorDashboard = ({ number, title, active }) => (
    <View style={styles.step}>
      <View style={[styles.stepCircleDashboard, active && styles.stepCircleActiveDashboard]}>
        <MaterialIcon name="done" size={14} color="#fff" />
      </View>
      <Text style={[styles.stepTitleDashboard, active && styles.stepTitleActiveDashboard]}>{title}</Text>
    </View>
);


// ===============================================
// 3. SCREEN COMPONENTS
// ===============================================

const HomeScreen = ({ onNavigate }) => {
    const handleContinue = () => {
        onNavigate('LoginGateway');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.welcomeTitle}>Welcome to Smart Queue Management</Text>
            <Text style={styles.welcomeSubtitle}>Smart Queue, Smarter Care</Text>
            <Text style={styles.welcomeAction}>Get started with your hospital visit</Text>

            <View style={styles.card}>
                <Icon name="hospital" size={24} color="#465ad7ff" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Login Portal</Text>
                <Link href ="/inforegister">
                     <Text style={styles.statsCount}> DATA →</Text>
                </Link>
                     
                <View style={styles.noteBox}>
                    <Icon name="info-circle" size={16} color="#3498db" style={styles.noteIcon} />
                    <Text style={styles.noteText}>Note: One token for all departments - lab, pharmacy, consultation, and records.</Text>
                </View>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleContinue} 
                >
                    <Text style={styles.buttonText}>Continue →</Text>
          
                </TouchableOpacity>
                
            </View>

            

            <View style={styles.footer}>
                <Icon name="bolt" size={12} color="#599cc8ff" />
                <Text style={styles.footerText}>Smart Queue Management System</Text>
                <Icon name="check-circle" size={12} color="#4b8563ff" />
                <Text style={styles.footerDetails}>Next-Generation Hospital Queue System • AI-Powered Smart Tokens • Real-time Digital Updates</Text>
            </View>
        </ScrollView>
    );
};


const DashboardScreen = ({ onNavigate }) => {
    return (
        <ScrollView contentContainerStyle={styles.dashboardContainer}>
            
            <View style={styles.dashboardHeader}>
                <Text style={styles.dashboardTitle}>Medical Services Dashboard</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => console.log('Settings')} style={styles.headerButton}>
                        <Icon name="cog" size={16} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Update Details')} style={styles.headerButton}>
                        <Icon name="pen" size={16} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.headerButton}>
                        <Icon name="sign-out-alt" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            
            <View style={styles.userInfoCard}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="user-circle" size={30} color="#3498db" style={{marginRight: 10}} />
                    <View>
                        <Text style={styles.welcomeText}>Welcome back SPARTANS</Text>
                        <Text style={styles.userInfoText}>SPARTANS@gmail.com</Text>
                        <Text style={styles.userInfoText}>1234567890</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionHeader}>Select Your Service Category</Text>

            <ServiceBox 
                icon="user-md" 
                title="General Consultation" 
                subtitle="Regular checkup and consultation services" 
                queue={0} 
                color="#0033ffff"
                // Pass service type for scheduling
                onBook={() => onNavigate('TokenGeneration', {serviceType: 'GEN', serviceName: 'General Consultation', color: '#0033ffff'})} 
            />
            
            <ServiceBox 
                icon="exclamation-triangle" 
                title="Emergency Service" 
                subtitle="Immediate medical attention required" 
                queue={0} 
                color="#dc3e2cff"
                // Pass service type for scheduling
                onBook={() => onNavigate('EmergencyRegistration', {serviceType: 'EME', serviceName: 'Emergency Service', color: '#dc3e2cff'})} 
            />
            
            <ServiceBox 
                icon="wheelchair" 
                title="Accessibility Service" 
                subtitle="Specialized care with assistance" 
                queue={0} 
                color="#309935ff"
                // Pass service type for scheduling
                onBook={() => onNavigate('AccessibilityRegistration', {serviceType: 'ACE', serviceName: 'Accessibility Service', color: '#309935ff'})} 
            />

            <View style={styles.statsBox}>
                <Icon name="chart-line" size={18} color="#333" style={{marginRight: 15}} />
                <View style={{flex: 1}}>
                    <Text style={styles.statsTitle}>Department Statistics</Text>
                    <Text style={styles.statsSubtitle}>View detailed information about all departments and doctors</Text>
                </View>
                <Link href ="/department">
                     <Text style={styles.statsCount}> Departments →</Text>
                </Link>
            </View>

            <View style={styles.historyBox}>
                <Icon name="history" size={18} color="#333" style={{marginRight: 15}} />
                <View style={{flex: 1}}>
                    <Text style={styles.statsTitle}>Patient History</Text>
                    <Text style={styles.statsSubtitle}>View your complete medical history across all services</Text>
                </View>
                <Link href ="/history">
                     <Text style={styles.statsCount}> History →</Text>
                </Link>
            </View>

            <View style={styles.contactFooter}>
                <Text style={styles.contactText}>Hospital Hours: 24/7 Emergency consultation</Text>
                <Text style={styles.contactText}>
                    <Icon name="phone" size={10} color="#e74c3c" /> Emergency Helpline: 108 • 
                    <Icon name="envelope" size={10} color="#3498db" /> help@hospital.gov.in
                </Text>
            </View>
        </ScrollView>
    );
};


const TokenGenerationScreen = ({ onNavigate, params }) => {
    const [age, setAge] = useState('99');
    const [gender, setGender] = useState('Male');
    const [primaryDepartment, setPrimaryDepartment] = useState('General Medicine');
    
    const handleContinue = () => {
        // Pass essential info for scheduling (service type and name)
        onNavigate('Scheduling', {serviceType: params.serviceType, serviceName: params.serviceName, color: params.color, patientDetails: {name: "SPARTANS", phone: "1234567890", department: primaryDepartment}});
    };

    return (
        <ScrollView contentContainerStyle={styles.tokenContainer}>
            <View style={styles.tokenHeader}>
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={{ paddingRight: 15 }}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.tokenTitle}>Multi-Department Token Generation</Text>
                <Text style={styles.tokenStep}>Step 1 of 3</Text>
            </View>

            <View style={styles.patientInfoBlock}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="user-circle" size={20} color="#3498db" style={{ marginRight: 10 }} />
                    <Text style={styles.patientInfoTextBold}>Patient: SPARTANS</Text>
                </View>
                <Text style={styles.patientInfoText}>SPARTANS@gmail.com • 1234567890</Text>
            </View>

            <View style={styles.medicalInfoCard} >
                <View style={styles.cardSectionTitle}>
                    <Icon name="user" size={18} color="#666" style={{ marginRight: 10 }} />
                    <Text style={styles.cardSectionTitleText}>Enter Patient Details</Text>
                </View>
                <Text style={styles.inputLabel}>Name </Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter Name"
                    defaultValue="SPARTANS"
                    editable={false}
                    keyboardType='default'
                />

                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.radioGroup}>
                    {['Male', 'Female', 'Other'].map(option => (
                        <TouchableOpacity key={option} onPress={() => setGender(option)} style={styles.radioOption}>
                            <Icon 
                                name={gender === option ? 'dot-circle' : 'circle'} 
                                size={16} 
                                color={gender === option ? '#3498db' : '#ccc'} 
                            />
                            <Text style={styles.radioText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.inputLabel}>Primary Department </Text>
                <Text style={styles.inputHint}>Main department for your visit</Text>
               <View style={styles.pickerContainer}>
                       <Picker
                            selectedValue={primaryDepartment}
                            onValueChange={(itemValue) => setPrimaryDepartment(itemValue)}>
                            <Picker.Item label="General Medicine" value="General Medicine" />
                            <Picker.Item label="Cardiology" value="Cardiology" />
                            <Picker.Item label="Neurology" value="Neurology" />
                            <Picker.Item label="Orthopedics" value="Orthopedics" />
                            <Picker.Item label="Pediatrics" value="Pediatrics" />
                            <Picker.Item label="Gynecology" value="Gynecology" />
                       </Picker>
                   </View>                 
            </View>
            
            <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
            >
                <Text style={styles.continueButtonText}> Continue to Scheduling Options </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


const EmergencyRegistrationScreen = ({ onNavigate, params }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(null);
    const [severity, setSeverity] = useState('Critical - Life threatening');
    const [emergencyCondition, setEmergencyCondition] = useState('');
    const [requiresAccessibility, setRequiresAccessibility] = useState(false);
    const [emergencyDepartment, setEmergencyDepartment] = useState('Triage / ER');
    
    const [accessibilityNeeds, setAccessibilityNeeds] = useState([]);
    const [supportServices, setSupportServices] = useState([]);
    const [otherSupport, setOtherSupport] = useState('');

    const toggleAccessibility = () => {
        setRequiresAccessibility(prev => !prev);
    };

    const handleNeedToggle = (need) => {
        setAccessibilityNeeds(prev => 
            prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
        );
    };

    const handleSupportToggle = (service) => {
        setSupportServices(prev => 
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    const accessibilityNeedOptions = [
        { key: 'Mobility Impairment', icon: 'wheelchair' },
        { key: 'Visual Impairment', icon: 'low-vision' },
        { key: 'Hearing Impairment', icon: 'deaf' },
        { key: 'Cognitive Disability', icon: 'brain' },
        { key: 'Multiple Disabilities', icon: 'user-friends' },
        { key: 'Other', icon: 'asterisk' },
    ];
    
    const supportServiceOptions = [
        'Wheelchair assistance',
        'Sign language interpreter',
        'Braille documents',
        'Audio assistance',
        'Personal care attendant',
        'Accessible parking',
        'Elevator access',
        'Accessible restroom',
        'Extra time for procedures',
        'Companion support',
    ];
      const allDepartments = [
        { label: 'General Medicine', value: "General Medicine" },
        { label: 'Cardiology', value: "Cardiology" },
        { label: 'Orthopedics', value: "Orthopedics" },
        { label: 'Neurology', value: "Neurology" },
        { label: 'Pediatrics', value: "Pediatrics" },
        { label: 'Gynecology', value: "Gynecology" },
    ];
    const NeedButton = ({ need, icon, isSelected, onPress }) => (
        <TouchableOpacity 
            style={[styles.needButton, isSelected && styles.needButtonSelected]}
            onPress={onPress}
        >
            <Icon name={icon} size={18} color={isSelected ? '#fff' : '#333'} />
            <Text style={[styles.needButtonText, isSelected && styles.needButtonTextSelected]}>{need}</Text>
        </TouchableOpacity>
    );


    const AccessibilityDetailsForm = () => (
        <View style={styles.accessibilityForm}>
            <Text style={styles.subSectionTitle}>Type of Accessibility Need</Text>
            <View style={styles.needsGroup}>
                {accessibilityNeedOptions.map(option => (
                    <NeedButton
                        key={option.key}
                        need={option.key}
                        icon={option.icon}
                        isSelected={accessibilityNeeds.includes(option.key)}
                        onPress={() => handleNeedToggle(option.key)}
                    />
                ))}
            </View>

            <Text style={[styles.subSectionTitle, {marginTop: 20}]}>Support Services Required</Text>
            <View style={styles.supportGroup}>
                {supportServiceOptions.map((service, index) => (
                    <View key={index} style={styles.checkboxItem}>
                        <TouchableOpacity onPress={() => handleSupportToggle(service)}>
                            <Icon 
                                name={supportServices.includes(service) ? 'check-square' : 'square'} 
                                size={20} 
                                color={supportServices.includes(service) ? '#3498db' : '#999'} 
                            />
                        </TouchableOpacity>
                        <Text style={styles.checkboxText}>{service}</Text>
                    </View>
                ))}
                    <View style={styles.checkboxItem}>
                        <TouchableOpacity onPress={() => handleSupportToggle('Other (please specify)')}>
                            <Icon 
                                name={supportServices.includes('Other (please specify)') ? 'check-square' : 'square'} 
                                size={20} 
                                color={supportServices.includes('Other (please specify)') ? '#3498db' : '#999'} 
                            />
                        </TouchableOpacity>
                        <Text style={styles.checkboxText}>Other (please specify)</Text>
                    </View>
                    {supportServices.includes('Other (please specify)') && (
                        <TextInput
                            style={styles.otherSupportInput}
                            placeholder="Describe any other assistance needed during emergency care"
                            value={otherSupport}
                            onChangeText={setOtherSupport}
                            multiline
                        />
                    )}
            </View>
        </View>
    );

    const handleGenerate = () => {
        // Pass essential info for scheduling (service type and name)
        onNavigate('Scheduling', {serviceType: params.serviceType, serviceName: params.serviceName, color: params.color, patientDetails: {name: "SPARTANS", phone: "1234567890", department: emergencyDepartment}});
    };

    return (
        <ScrollView contentContainerStyle={styles.emergencyContainer}>
            <View style={styles.emergencyHeader}>
                
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={{ paddingRight: 15 }}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.emergencyTitle}>Emergency Service Registration</Text>
            </View>

            
            <View style={styles.patientInfoBlockEmergency}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="user-circle" size={20} color="#d23535ff" style={{ marginRight: 10 }} />
                    <Text style={styles.patientInfoTextBold}>Patient: SPARTANS</Text>
                </View>
                <Text style={styles.patientInfoText}>SPARTANS@gmail.com • 1234567890</Text>
            </View>

          
            <View style={styles.emergencyFormCard}>
                <View style={styles.emergencyFormHeader}>
                    <Icon name="exclamation-triangle" size={18} color="#d23535ff" style={{ marginRight: 10 }} />
                    <Text style={styles.emergencyFormTitle}>Emergency Registration Form</Text>
                </View>
                <Text style={styles.emergencyFormSubtitle}>Critical cases requiring immediate attention - High priority access</Text>

        
                <Text style={styles.inputLabel}>Age *</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter patient age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                
            
                <Text style={styles.inputLabel}>Gender *</Text>
                <View style={styles.radioGroup}>
                    {['Male', 'Female', 'Other'].map(option => (
                        <TouchableOpacity key={option} onPress={() => setGender(option)} style={styles.radioOption}>
                            <Icon 
                                name={gender === option ? 'dot-circle' : 'circle'} 
                                size={16} 
                                color={gender === option ? '#924f4fff' : '#ccc'} 
                            />
                            <Text style={styles.radioText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

        
                <Text style={styles.inputLabel}>Emergency Department </Text>
                <Text style={styles.inputHint}>Main department for your visit</Text>
                <View style={styles.pickerContainer}>
                       <Picker
                            selectedValue={emergencyDepartment}
                            onValueChange={(itemValue) => setEmergencyDepartment(itemValue)}>
                            <Picker.Item label="General Medicine" value="General Medicine" />
                            <Picker.Item label="Cardiology" value="Cardiology" />
                            <Picker.Item label="Neurology" value="Neurology" />
                            <Picker.Item label="Orthopedics" value="Orthopedics" />
                            <Picker.Item label="Pediatrics" value="Pediatrics" />
                            <Picker.Item label="Gynecology" value="Gynecology" />
                       </Picker>
                   </View>                 
            


                
                <Text style={[styles.inputLabel, {marginTop: 25}]}>Emergency Severity *</Text>
                <View style={styles.severityGroup}>
                    {['Critical - Life threatening', 'Urgent - Immediate attention', 'Moderate - Can wait briefly'].map(option => (
                        <TouchableOpacity key={option} onPress={() => setSeverity(option)} style={styles.radioOption}>
                            <Icon 
                                name={severity === option ? 'dot-circle' : 'circle'} 
                                size={16} 
                                color={severity === option ? '#c13c3cff' : '#ccc'} 
                            />
                            <Text style={[styles.radioText, {fontWeight: severity === option ? 'bold' : 'normal', color: severity === option ? '#e74c3c' : '#333'}]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
        
                <Text style={[styles.inputLabel, {marginTop: 15}]}>Emergency Condition Details *</Text>
                <TextInput
                    style={[styles.inputBox, {height: 80, textAlignVertical: 'top'}]}
                    placeholder="Describe the emergency condition, symptoms, and immediate concerns in detail"
                    value={emergencyCondition}
                    onChangeText={setEmergencyCondition}
                    multiline
                />

        
                <Text style={[styles.inputLabel, {marginTop: 25}]}>Accessibility Support (Optional)</Text>
                <TouchableOpacity onPress={toggleAccessibility} style={styles.accessibilityToggle}>
                    <Icon 
                        name={requiresAccessibility ? 'check-square' : 'square'} 
                        size={20} 
                        color={requiresAccessibility ? '#ad3838ff' : '#999'} 
                        style={{marginRight: 8}}
                    />
                    <Text style={styles.checkboxText}>Patient requires accessibility assistance</Text>
                </TouchableOpacity>
                <Text style={styles.inputHint}>Check if the patient needs special assistance or accommodations during emergency care</Text>
                
                {requiresAccessibility && <AccessibilityDetailsForm />}


                <Text style={[styles.inputLabel, {marginTop: 25}]}>Medical Documentation (Optional)</Text>
                <View style={styles.documentationGroup}>
                    <TouchableOpacity style={styles.docButton}>
                        <Icon name="cloud-upload-alt" size={16} color="#3498db" />
                        <Text style={styles.docButtonText}>Upload Medical Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.docButton}>
                        <Icon name="camera" size={16} color="#3498db" />
                        <Text style={styles.docButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <TouchableOpacity 
                style={styles.emergencyContinueButton}
                onPress={handleGenerate}
            >
                <Text style={styles.emergencyContinueButtonText}>Generate Emergency Token </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const AccessibilityRegistrationScreen = ({ onNavigate, params }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(null);
    const [primaryDepartment, setPrimaryDepartment] = useState('Accessibility Consultation');
    const [priorityLevel, setPriorityLevel] = useState('Standard Priority');
    const [accessibilityNeeds, setAccessibilityNeeds] = useState([]);
    const [supportServices, setSupportServices] = useState([]);
    const [otherSupport, setOtherSupport] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [caregiverName, setCaregiverName] = useState('');
    const [caregiverPhone, setCaregiverPhone] = useState('');

    const accessibilityNeedOptions = [
        { key: 'Mobility Impairment', icon: 'wheelchair' },
        { key: 'Visual Impairment', icon: 'low-vision' },
        { key: 'Hearing Impairment', icon: 'deaf' },
        { key: 'Cognitive Disability', icon: 'brain' },
        { key: 'Multiple Disabilities', icon: 'user-friends' },
        { key: 'Other', icon: 'asterisk' },
    ];

    const supportServiceOptions = [
        'Wheelchair assistance', 'Sign language interpreter',
        'Braille documents', 'Audio assistance',
        'Personal care attendant', 'Accessible parking',
        'Elevator access', 'Accessible restroom',
        'Extra time for procedures', 'Companion support',
    ];

    const handleNeedToggle = (need) => {
        setAccessibilityNeeds(prev => 
            prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
        );
    };

    const handleSupportToggle = (service) => {
        setSupportServices(prev => 
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    const NeedButton = ({ need, icon, isSelected, onPress }) => (
        <TouchableOpacity 
            style={[styles.needButton, isSelected && styles.needButtonSelected]}
            onPress={onPress}
        >
            <Icon name={icon} size={18} color={isSelected ? '#fff' : '#333'} />
            <Text style={[styles.needButtonText, isSelected && styles.needButtonTextSelected]}>{need}</Text>
        </TouchableOpacity>
    );

    const handleGenerate = () => {
        // Pass essential info for scheduling (service type and name)
        onNavigate('Scheduling', {serviceType: params.serviceType, serviceName: params.serviceName, color: params.color, patientDetails: {name: "SPARTANS", phone: "1234567890", department: primaryDepartment}});
    };

    return (
        <ScrollView contentContainerStyle={styles.emergencyContainer}>
            <View style={styles.emergencyHeader}>
                {/* Back button to Dashboard */}
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={{ paddingRight: 15 }}>
                    <Icon name="arrow-left" size={20} color="#6ab54aff" />
                </TouchableOpacity>
                <Text style={styles.accessibilityTitle}>Accessibility Services</Text>
                <View style={styles.priorityBox}>
                    <Icon name="hand-point-right" size={14} color="#41c42cff" style={{ marginRight: 5 }} />
                    <Text style={styles.priorityText}>Priority Service</Text>
                </View>
            </View>

            
            <View style={styles.supportInfoCard}>
                <View style={styles.emergencyPatientInfoBlock}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="user-circle" size={20} color="#7ac92fff" style={{ marginRight: 10 }} />
                    <Text style={styles.patientInfoTextBold}>Patient: SPARTANS</Text>
                </View>
                <Text style={styles.patientInfoText}>SPARTANS@gmail.com • 1234567890</Text>
            </View>
                <View style={styles.emergencyFormHeader}>
                    <Icon name="universal-access" size={18} color="#36c936ff" style={{ marginRight: 10 }} />
                    <Text style={styles.accessibilityFormTitle}>Accessibility Support</Text>
                </View>
                <Text style={styles.supportInfoText}>Our hospital provides priority service and specialized assistance for patients with disabilities. Please specify your needs and we'll ensure appropriate support is arranged for you, including:</Text>
                <View style={styles.supportBulletContainer}>
                    <Text style={styles.supportBullet}>• Priority queue access across desired departments</Text>
                    <Text style={styles.supportBullet}>• Dedicated staff for assistance available</Text>
                    <Text style={styles.supportBullet}>• Accessible facilities and equipment</Text>
                </View>
            </View>

            <View style={styles.medicalInfoCard}>
                <View style={styles.cardSectionTitle}>
                    <Icon name="info-circle" size={18} color="#666" style={{ marginRight: 10 }} />
                    <Text style={styles.cardSectionTitleText}>Accessibility Information & Support Request</Text>
                </View>

                <Text style={styles.inputLabel}>Medical Information</Text>
                <Text style={styles.inputLabel}>Age </Text>
                
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
                
                <Text style={styles.inputLabel}>Gender </Text>
                <View style={styles.radioGroup}>
                    {['Male', 'Female', 'Other'].map(option => (
                        <TouchableOpacity key={option} onPress={() => setGender(option)} style={styles.radioOption}>
                            <Icon 
                                name={gender === option ? 'dot-circle' : 'circle'} 
                                size={16} 
                                color={gender === option ? '#3498db' : '#ccc'} 
                            />
                            <Text style={styles.radioText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.inputLabel}>Primary Department </Text>
                <Text style={styles.inputHint}>Main department for your consultation</Text>
                <View style={styles.pickerContainer}>
                       <Picker
                            selectedValue={primaryDepartment}
                            onValueChange={(itemValue) => setPrimaryDepartment(itemValue)}>
                            <Picker.Item label="General Medicine" value="General Medicine" />
                            <Picker.Item label="Cardiology" value="Cardiology" />
                            <Picker.Item label="Neurology" value="Neurology" />
                            <Picker.Item label="Orthopedics" value="Orthopedics" />
                            <Picker.Item label="Pediatrics" value="Pediatrics" />
                            <Picker.Item label="Gynecology" value="Gynecology" />
                       </Picker>
                   </View>                 

                <Text style={[styles.inputLabel, { marginTop: 20 }]}>Accessibility Information</Text>
                <Text style={styles.inputLabel}>Type of Accessibility Need</Text>
                <View style={styles.needsGroup}>
                    {accessibilityNeedOptions.map(option => (
                        <NeedButton
                            key={option.key}
                            need={option.key}
                            icon={option.icon}
                            isSelected={accessibilityNeeds.includes(option.key)}
                            onPress={() => handleNeedToggle(option.key)}
                        />
                    ))}
                </View>
                
                <Text style={[styles.inputLabel, { marginTop: 15 }]}>Additional Details</Text>
                <Text style={styles.inputHint}>Please provide additional details about your accessibility needs and any specific requirements</Text>
                <TextInput
                    style={[styles.inputBox, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Describe any other assistance or support you need"
                    value={additionalDetails}
                    onChangeText={setAdditionalDetails}
                    multiline
                />

                <Text style={[styles.inputLabel, { marginTop: 25 }]}>Priority Level</Text>
                <View style={styles.radioGroupAccess}>
                    {['Standard Priority', 'High Priority (Urgent Care)'].map(option => (
                        <TouchableOpacity key={option} onPress={() => setPriorityLevel(option)} style={styles.radioOption}>
                            <Icon 
                                name={priorityLevel === option ? 'dot-circle' : 'circle'} 
                                size={16} 
                                color={priorityLevel === option ? '#3498db' : '#ccc'} 
                            />
                            <Text style={[styles.radioText, { fontWeight: priorityLevel === option ? 'bold' : 'normal' }]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support Services Required */}
                <Text style={[styles.inputLabel, { marginTop: 20 }]}>Support Services Required </Text>
                <View style={styles.supportGroupAccess}>
                    {supportServiceOptions.map((service, index) => (
                        <View key={index} style={styles.checkboxItemAccess}>
                            <TouchableOpacity onPress={() => handleSupportToggle(service)}>
                                <Icon 
                                    name={supportServices.includes(service) ? 'check-square' : 'square'} 
                                    size={20} 
                                    color={supportServices.includes(service) ? '#3498db' : '#999'} 
                                />
                            </TouchableOpacity>
                            <Text style={styles.checkboxText}>{service}</Text>
                        </View>
                    ))}
                    <View style={styles.checkboxItemAccess}>
                        <TouchableOpacity onPress={() => handleSupportToggle('Other (please specify)')}>
                            <Icon 
                                name={supportServices.includes('Other (please specify)') ? 'check-square' : 'square'} 
                                size={20} 
                                color={supportServices.includes('Other (please specify)') ? '#3498db' : '#999'} 
                            />
                        </TouchableOpacity>
                        <Text style={styles.checkboxText}>Other (please specify)</Text>
                    </View>
                </View>
                {supportServices.includes('Other (please specify)') && (
                    <TextInput
                        style={styles.otherSupportInput}
                        
                        placeholder="Describe any other assistance or support you need"
                        value={otherSupport}
                        onChangeText={setOtherSupport}
                        multiline
                    />
                )}

            </View>

            {/* Caregiver Information (Optional) Card */}
            <View style={styles.caregiverCard}>
                <View style={styles.cardSectionTitle}>
                    <Icon name="hand-holding-heart" size={18} color="#2ecc71" style={{ marginRight: 10 }} />
                    <Text style={[styles.cardSectionTitleText, { color: '#2ecc71' }]}>Caregiver Information (Optional)</Text>
                </View>
                
                <Text style={styles.inputLabel}>Caregiver Name</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter caregiver name"
                    value={caregiverName}
                    onChangeText={setCaregiverName}
                />
                
                <Text style={styles.inputLabel}>Caregiver Phone</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter caregiver phone"
                    value={caregiverPhone}
                    onChangeText={setCaregiverPhone}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Generate Token Button */}
            <TouchableOpacity 
                style={styles.accessContinueButton}
                onPress={handleGenerate}
            >
                <Text style={styles.continueButtonText}>Generate Priority Accessibility Token</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


// ----------------------------------------------------
// SCHEDULING AND TOKEN DETAILS SCREENS (Final Steps)
// ----------------------------------------------------

const SchedulingScreen = ({ onNavigate, params }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
    
    const handleConfirm = () => {
        if (selectedSlot) {
            // 1. GENERATE FINAL TOKEN ID with correct prefix
            const tokenID = generateTokenID(params.serviceType); 
            
            // 2. Navigate to TokenDetails with all necessary data
            onNavigate('TokenDetails', {...params, tokenID, selectedSlot});
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scheduleContainer}>
            <View style={styles.tokenHeader}>
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={{ paddingRight: 15 }}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.tokenTitle}>Schedule Appointment</Text>
                <Text style={styles.tokenStep}>Step 2 of 3</Text>
            </View>

            <View style={[styles.serviceDetailsCard, {borderLeftColor: params.color}]}>
                <Text style={styles.scheduleServiceName}>{params.serviceName}</Text>
                <Text style={styles.scheduleSubtitle}>Book your preferred time slot for {params.patientDetails?.department}.</Text>
            </View>

            <Text style={styles.sectionHeader}>Available Time Slots (Today)</Text>
            
            <View style={styles.slotGrid}>
                {timeSlots.map(slot => (
                    <TouchableOpacity
                        key={slot}
                        style={[
                            styles.slotButton,
                            selectedSlot === slot && { backgroundColor: params.color, borderColor: params.color },
                        ]}
                        onPress={() => setSelectedSlot(slot)}
                    >
                        <Text style={[
                            styles.slotText, 
                            selectedSlot === slot && { color: '#fff' }
                        ]}>
                            {slot}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.scheduleSubtitleSmall}>Note: Arrival is recommended 15 minutes before the scheduled time.</Text>

            <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: selectedSlot ? params.color : '#ccc' }]}
                onPress={handleConfirm}
                disabled={!selectedSlot}
            >
                <Text style={styles.confirmButtonText}>Confirm Slot & Get Token</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


const TokenDetailsScreen = ({ onNavigate, params }) => {
    const { tokenID, patientDetails, serviceName, selectedSlot, color } = params;

    return (
        <ScrollView contentContainerStyle={styles.tokenDetailsContainer}>
             <View style={styles.tokenHeader}>
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={{ paddingRight: 15 }}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.tokenTitle}>Your Queue Token</Text>
                <Text style={styles.tokenStep}>Step 3 of 3</Text>
            </View>

            <View style={styles.tokenCard}>
                <Text style={[styles.subText, {fontSize: 18, marginBottom: 15}]}>Your appointment is confirmed!</Text>
                
                <Text style={styles.tokenDisplayLabel}>Token ID:</Text>
                <Text style={[styles.tokenDisplay, {color: color}]}>{tokenID}</Text>
                
                <Text style={styles.subText}>Patient Name: {patientDetails.name}</Text>
                <Text style={styles.subText}>Phone: {patientDetails.phone}</Text>
                <Text style={styles.subText}>Service: {serviceName}</Text>
                <Text style={styles.subText}>Department: {patientDetails.department}</Text>
                <Text style={styles.subText}>Time Slot: <Text style={{fontWeight: 'bold', color: color}}>{selectedSlot}</Text></Text>

                {/* QR Code Placeholder - Displays Token ID */}
                <View style={styles.qrContainer}>
                    {/* Dynamic QR Code - Generates based on Token ID */}
              
                   <QRCode
                        value={tokenID} 
                        size={150}
                        color="black"
                        backgroundColor="white"
                    />
                      <Text style={styles.qrText}>Scan for Patient ID</Text>
                      <Text style={styles.qrValue}>{tokenID}</Text>
               
                </View>

                <View style={[styles.infoBox, {borderColor: color}]}>
                    <Icon name="info-circle" size={16} color={color} style={{ marginRight: 10 }} />
                    <Text style={styles.infoText}>Present this QR code and Token ID at the reception counter.</Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.button, {backgroundColor: color, marginTop: 20}]}
                    onPress={() => onNavigate('Dashboard')} 
                >
                    <Text style={styles.buttonText}>Return to Dashboard</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


// ----------------------------------------------------
// LOGIN COMPONENTS (Simplified for brevity)
// ----------------------------------------------------

const PatientLoginScreen = ({ onNavigate }) => {
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    const handleLogin = () => { onNavigate('Dashboard'); };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.loginContainerForm} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backButton}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.languageDropdownArea}>
                    <Text style={styles.LanguageLabel}>Language</Text>
                    <View style={styles.languagePickerContainer}> 
                        <Picker selectedValue={selectedLanguage} onValueChange={setSelectedLanguage} style={styles.languagePicker}>
                            <Picker.Item label="English" value="english" />
                             <Picker.Item label="Hindi" value="hindi"/>
                             <Picker.Item label="Telugu" value="telugu" />
                            <Picker.Item label="Tamil" value="tamil" />
                            <Picker.Item label="Marathi" value="marathi" />
                            <Picker.Item label="Punjabi" value="punjabi" />
                        </Picker>
                    </View>
                </View>
                
                <View style={styles.logoPlaceholder}>
                    <Image source={Logo} style={styles.logoImage} />
                 </View>

                <View style={styles.forms}>
                    <View style={styles.tabRow}>
                        <TouchableOpacity style={[styles.patientButton, {backgroundColor: '#1a83d3'}]} onPress={() => onNavigate('PatientLogin')}>
                            <Text style={[styles.tabText, {color: '#fff'}]}>Patient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.staffButton, {backgroundColor: '#ccc'}]} onPress={() => onNavigate('StaffLogin')}>
                            <Text style={styles.tabText}>Staff</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="#1a83d3" />
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.pickerContainer}> 
                        <Picker selectedValue={selectedGender} onValueChange={setSelectedGender} style={styles.picker}>
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View> 
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor="#1a83d3" keyboardType="phone-pad" />
                    <View style={styles.sendBtn}>
                        <Button title="Send OTP" onPress={handleLogin} color="#1a83d3" />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const StaffLoginScreen = ({ onNavigate }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [staffId, setStaffId] = useState('');
    const handleLogin = () => { onNavigate('Dashboard'); };
    
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.loginContainerForm} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backButton}>
                    <Icon name="arrow-left" size={20} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.languageDropdownArea}>
                    <Text style={styles.LanguageLabel}>Language</Text>
                    <View style={styles.languagePickerContainer}> 
                        <Picker selectedValue={selectedLanguage} onValueChange={setSelectedLanguage} style={styles.languagePicker}>
                            <Picker.Item label="English" value="english" />
                            <Picker.Item label="Hindi" value="hindi"/>
                            <Picker.Item label="Telugu" value="telugu" />
                            <Picker.Item label="Tamil" value="tamil" />
                            <Picker.Item label="Marathi" value="marathi" />
                            <Picker.Item label="Punjabi" value="punjabi" />
                        </Picker>
                    </View>
                </View>
                
               
                  <View style={styles.logoPlaceholder}>
                    <Image source={Logo} style={styles.logoImage} />
                 </View>
                
                <View style={styles.forms}>
                    <View style={styles.tabRow}>
                        <TouchableOpacity style={[styles.patientButton, {backgroundColor: '#ccc'}]} onPress={() => onNavigate('PatientLogin')}>
                            <Text style={styles.tabText}>Patient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.staffButton, {backgroundColor: '#63bd4dff'}]} onPress={() => onNavigate('StaffLogin')}>
                            <Text style={[styles.tabText, {color: '#000'}]}>Staff</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Staff ID / Name</Text>
                    <TextInput style={styles.input} placeholder="Enter your Staff ID or name" placeholderTextColor="#1a83d3" value={staffId} onChangeText={setStaffId} />
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#1a83d3" secureTextEntry />

                    <View style={styles.sendBtn}>
                        <Button title="Login" onPress={() => onNavigate('StaffDashboard')} color='#63bd4dff' />
                       
                <Link href ="/staffdashboard">
                  <Text style={styles.statsCount}> Login →</Text>
                </Link>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const AppEntry = () => {
    const [currentScreen, setCurrentScreen] = useState('Home'); 
    const [navigationParams, setNavigationParams] = useState({});

    const navigateTo = (screenName, params = {}) => {
        setNavigationParams(params);
        setCurrentScreen(screenName);
    };

    let content;
    if (currentScreen === 'Home') {
        content = <HomeScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'LoginGateway' || currentScreen === 'PatientLogin') {
        content = <PatientLoginScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'StaffLogin') {
        content = <StaffLoginScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'Dashboard') {
        content = <DashboardScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'DEPARTMENT_DATA') {
        content = <DashboardScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'PatientHistoryScreen') {
        content = <DashboardScreen onNavigate={navigateTo} />;    
    } else if (currentScreen === 'TokenGeneration') { 
        content = <TokenGenerationScreen onNavigate={navigateTo} params={navigationParams} />;
    } else if (currentScreen === 'EmergencyRegistration') { 
        content = <EmergencyRegistrationScreen onNavigate={navigateTo} params={navigationParams} />;
    }else if (currentScreen === 'AccessibilityRegistration') { 
        content = <AccessibilityRegistrationScreen onNavigate={navigateTo} params={navigationParams} />;
    } else if (currentScreen === 'Scheduling') { 
        content = <SchedulingScreen onNavigate={navigateTo} params={navigationParams} />;
    } else if (currentScreen === 'TokenDetails') { 
        content = <TokenDetailsScreen onNavigate={navigateTo} params={navigationParams} />;
    }else if (currentScreen === 'inforegister') {
        content = <DashboardScreen onNavigate={navigateTo} />;    
    }else if (currentScreen === 'qrtokengen') {
        content = <DashboardScreen onNavigate={navigateTo} />;    
    } else if (currentScreen === 'Home') {
        content = <StaffLoginScreen onNavigate={navigateTo} />;
    } else if (currentScreen === 'StaffDashboard') {
        content = <StaffDashboardScreen onNavigate={navigateTo} />;
    }

    return (
        <View style={styles.mainContainer}>
            {content}
        </View>
    );
};


// ===============================================
// 5. STYLESHEET
// ===============================================

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // --- Global Styles ---
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f7fa',
        paddingTop: 80, 
    },
    welcomeTitle: {
        marginTop: 75,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 18,
        color: '#3498db',
        marginBottom: 5,
    },
    welcomeAction: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardIcon: {
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    noteBox: {
        flexDirection: 'row',
        backgroundColor: '#ebf5ff',
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    noteIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    noteText: {
        flex: 1,
        fontSize: 14,
        color: '#34495e',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 6,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginVertical: 5,
    },
    footerDetails: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },

    // --- LoginScreen Styles ---
    loginContainer: {
        flexGrow: 1,
        backgroundColor: '#f0f5ff',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    loginContainerForm: {
        flexGrow: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff5f5',
        paddingTop: 80, 
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 40,
        position: 'absolute', 
        top: 40, 
        left: 20
    },
    languageDropdownArea: {
        position: 'absolute',
        top: 30, 
        right: 20, 
        zIndex: 10, 
        width: 120, 
    },
    LanguageLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    languagePickerContainer: {
        height: 25,
        borderWidth: 1,
        borderColor: '#1a83d3',
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center', 
        width: '100%',
        left: 3,
    },
    languagePicker: {
        width: '100%',
        height: '100%',
        color: '#000',
        fontSize: 14,
    },
      logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E5E5E5",
    alignSelf: "center",
    },

     logoImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 0,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
     }, 
    forms: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        width: '100%',
        maxWidth: 400
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    patientButton: {
        paddingVertical: 10,
        paddingHorizontal:16,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '49%',
        textAlign: 'center'
    },
    staffButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        width: '49%',
        textAlign: 'center'
    },
    tabText: {
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
    },
    sendBtn: {
        marginTop: 8
    },
    pickerContainer: {
        height: 50,
        borderWidth: 1.5,
        borderColor: '#cccccc',
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden', 
        justifyContent: 'center',
        backgroundColor: '#fff', 
    },
    picker: {
        width: '100%',
        height: '100%',
        color: '#1a83d3', 
    },
    
    // --- DashboardScreen Styles ---
    dashboardContainer: {
        flexGrow: 1,
        backgroundColor: '#f0f5ff',
        padding: 20,
        paddingTop: 40,
    },
    dashboardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    dashboardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 5,
        marginLeft: 10,
    },
    userInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfoText: {
        fontSize: 14,
        color: '#666',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    serviceBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    serviceSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    queueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 5,
        borderRadius: 4,
    },
    queueLabel: {
        fontSize: 12,
        color: '#666',
    },
    queueCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    bookButton: {
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    bookButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    statsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    statsCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3f7faa',
    },
    historyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    contactFooter: {
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },  
    contactText: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
    },

    // --- TokenGenerationScreen Styles ---
    tokenContainer: {
        flexGrow: 1,
        backgroundColor: '#f0f5ff',
        padding: 20,
        paddingTop: 50,
    },
    tokenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tokenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    tokenStep: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3498db',
    },
    patientInfoBlock: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
      patientInfoBlockEmergency: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#d23535ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    patientInfoTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    patientInfoText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        marginLeft: 30, 
    },
    medicalInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardSectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        marginBottom: 15,
    },
    cardSectionTitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    inputHint: {
        fontSize: 12,
        color: '#999',
        marginBottom: 5,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    radioText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    dropdownBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    continueButton: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // --- EmergencyRegistrationScreen Styles ---
    emergencyContainer: {
        flexGrow: 1,
        backgroundColor: '#fff5f5',
        padding: 20,
        paddingTop: 50,
    },
    emergencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    emergencyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        flex: 1,
    },
    emergencyFormCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#e74c3c',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    emergencyFormHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(230, 222, 222, 1)',
        paddingBottom: 10,
        marginBottom: 15,
    },
    emergencyFormTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e74c3c',
    },
    emergencyFormSubtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    accessibilityTitle :{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2ecc71',
        flex: 1,
    },
    accessibilityFormTitle:{
        fontSize: 18,
        fontWeight: '600',
        color: '#2ecc71',
    },
    needButtonSelected: {
        backgroundColor: '#309935ff',
        borderColor: '#309935ff',
    },
    emergencyContinueButton: {
        backgroundColor: '#dc3e2cff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    emergencyContinueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // --- Accessibility Specific Styles ---
    priorityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ebf5ff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#3498db',
    },
    priorityText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#3498db',
    },
    supportInfoCard: {
        backgroundColor: '#f5faff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#3498db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    supportInfoText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    supportBulletContainer: {
        marginTop: 5,
        paddingLeft: 10,
    },
    supportBullet: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
    radioGroupAccess: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    supportGroupAccess: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    checkboxItemAccess: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '48%',
    },
    caregiverCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    accessContinueButton: {
        backgroundColor: '#309935ff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    
    // --- Scheduling Screen Styles ---
    scheduleContainer: {
        flexGrow: 1,
        backgroundColor: '#f0f5ff',
        padding: 20,
        paddingTop: 50,
    },
    scheduleServiceName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    scheduleSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    scheduleSubtitleSmall: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    serviceDetailsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    slotButton: {
        width: '48%',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    slotText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    confirmButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // --- Token Details Screen Styles ---
    tokenDetailsContainer: {
        flexGrow: 1,
        backgroundColor: '#f0f5ff',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    tokenCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    subText: {
        fontWeight:'500',
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        width: '100%',
    },
    tokenDisplayLabel: {
        fontWeight:'bold',
        fontSize: 18,
        marginBottom: 5,
        color: '#555',
    },
    tokenDisplay: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    qrContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    qrText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    qrValue: {
        fontSize: 12,
        color: '#666',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#f0faff',
        padding: 10,
        borderRadius: 4,
        marginTop: 15,
        borderLeftWidth: 3,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
       color: '#34495e',
     },
    
 }); 
 
 export default AppEntry;
