import React, { useState } from 'react';
import { Home, Menu, ArrowLeft } from "lucide-react-native";
import {Link} from 'expo-router'
import { useRouter } from 'expo-router'; 

import { 
  Icon,
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  Phone, 
  Users, 
  Stethoscope, 
  Briefcase 
} from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Sample Data

const DEPARTMENT_DATA = [
  {
    id: 'general_medicine',
    name: 'General Medicine',
    description: 'Deals with the diagnosis and non-surgical treatment of diseases.',
    doctors: [
      { id: '1a', name: 'Dr. Ravi Sharma', qualification: 'MBBS, MD - General Medicine', experience: '17 Years Experience', isUnavailable: false },
      { id: '1b', name: 'Dr. Anjali Arora', qualification: 'MBBS, DNB - Internal Medicine', experience: '10 Years Experience', isUnavailable: false },
      { id: '1c', name: 'Dr. Suresh Iyer', qualification: 'MBBS, MD, FRCP', experience: '22 Years Experience', isUnavailable: true },
    ],
  },
  {
    id: 'orthopedic',
    name: 'Orthopedic',
    description: 'Focuses on the musculoskeletal system.',
    doctors: [
      { id: '2a', name: 'Dr. Vinay Goel', qualification: 'MS Ortho, DNB', experience: '15 Years Experience', isUnavailable: false },
      { id: '2b', name: 'Dr. Priya Singh', qualification: 'D. Ortho, M.Ch (Orthopedics)', experience: '9 Years Experience', isUnavailable: false },
    ],
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Specializes in the heart and blood vessels.',
    doctors: [
      { id: '3a', name: 'Dr. Sarika Mehta', qualification: 'MD, DM Cardiology', experience: '25 Years Experience', isUnavailable: false },
      { id: '3b', name: 'Dr. Steven Niki', qualification: 'MBBS, MS, FRCS', experience: '12 Years Experience', isUnavailable: false },
      { id: '3c', name: 'Dr. Sudip Reddy', qualification: 'MD, DNB Cardiology', experience: '8 Years Experience', isUnavailable: true },
    ],
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Medical imaging to diagnose and treat diseases.',
    doctors: [
      { id: '4a', name: 'Dr. Cora Reynolds', qualification: 'MD - Radiology', experience: '18 Years Experience', isUnavailable: false },
      { id: '4b', name: 'Dr. Sam Charus', qualification: 'MBBS, DMRD', experience: '7 Years Experience', isUnavailable: false },
    ],
  },
];

// Helper Component: Doctor Card
const DoctorCard = ({ doctor }) => {
  const isUnavailable = doctor.isUnavailable;
  
  return (
    <View style={styles.doctorCard}>
      {/* Avatar Placeholder */}
      <View style={styles.avatarContainer}>
        <Stethoscope size={24} color="#0d9488" />
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName} numberOfLines={1}>{doctor.name}</Text>
        <Text style={styles.doctorQual}>{doctor.qualification}</Text>
        <View style={styles.experienceRow}>
            <Briefcase size={12} color="#9ca3af" style={{ marginRight: 4 }} />
            <Text style={styles.doctorExp}>{doctor.experience}</Text>
        </View>
      </View>

      {/* Action Button */}
       

      <TouchableOpacity
        style={[
          styles.bookButton,
          isUnavailable ? styles.bookButtonDisabled : styles.bookButtonActive
        ]}
        disabled={isUnavailable}
        onPress={() => !isUnavailable && Alert.alert("Booking", `Attempting to book with ${doctor.name}`)}
      >
        <Text style={styles.bookButtonText}>
          {isUnavailable ? "Unavailable" : "Book Now"}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

// Helper Component: Stat Box
const StatBox = ({ count, label, icon: Icon }) => (
  <View style={styles.statBox}>
    <Text style={styles.statCount}>{count}</Text>
    <View style={styles.statLabelContainer}>
      {Icon && <Icon size={14} color="#14b8a6" style={{ marginRight: 4 }} />}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

// Helper Component: Detail Item
const DetailItem = ({ label, value, icon: Icon }) => (
  <View style={styles.detailItem}>
    <Icon size={20} color="#0d9488" style={{ marginTop: 2, marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

// Main Application Component
const App = () => {
  const [expandedDepartment, setExpandedDepartment] = useState(DEPARTMENT_DATA[0].id);

  const toggleExpand = (departmentId) => {
    // Configure animation for smooth transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDepartment(expandedDepartment === departmentId ? null : departmentId);
  };

  const renderHeaderInfo = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTop}>
      <Text style={styles.headerTitle}>Department Information</Text>
      <TouchableOpacity>
          <Text style={styles.editButtonText}>Edit/Save</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.headerSubtitle}>
      Complete list of all the major departments and medical staff
    </Text>

    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Department Information</Text>
        <TouchableOpacity>
            <Text style={styles.editButtonText}>Edit/Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerSubtitle}>Complete list of all the major departments and medical staff</Text>

      {/* Hospital Stats Grid */}
      <View style={styles.statsContainer}>
        <StatBox count="10" label="Total Staff" icon={Users} />
        <View style={styles.statDivider} />
        <StatBox count="32" label="Specs" icon={Stethoscope} />
        <View style={styles.statDivider} />
        <StatBox count="22" label="Doctors" icon={Briefcase} />
      </View>

      {/* Location, Hours, Contact Info */}
      <View style={styles.detailsGrid}>
        <DetailItem 
          label="Location" 
          value="101 Medical Complex, New Delhi, India" 
          icon={MapPin} 
        />
        <DetailItem 
          label="Operating Hours" 
          value="Mon-Sat: 09:00 - 18:00" 
          icon={Clock} 
        />
        <DetailItem 
          label="Contact Information" 
          value="+91 98765 43210" 
          icon={Phone} 
        />
      </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Browse Staff by Department</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          
          {renderHeaderInfo()}

          {DEPARTMENT_DATA.map((department) => {
            const isExpanded = expandedDepartment === department.id;
            
            return (
              <View key={department.id} style={styles.departmentCard}>
                <TouchableOpacity
                  style={styles.departmentHeader}
                  onPress={() => toggleExpand(department.id)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.departmentName}>{department.name}</Text>
                    <Text style={styles.departmentCount}>{department.doctors.length} Doctors Available</Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={20} color="#6b7280" />
                  ) : (
                    <ChevronDown size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.departmentBody}>
                    <Text style={styles.departmentDescription}>{department.description}</Text>
                    <View style={styles.doctorList}>
                      {department.doctors.map((doctor, index) => (
                        <View key={doctor.id}>
                          <DoctorCard doctor={doctor} />
                          {/* Separator line except for last item */}
                          {index < department.doctors.length - 1 && <View style={styles.separator} />}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb', // gray-50
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    padding: 16,
    maxWidth: 600, // Roughly simulating max-w-4xl constraint for tablets
    alignSelf: 'center',
    width: '100%',
  },
  // Header Info Styles
  headerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow property for Android
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d9488', // teal-600
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280', // gray-500
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f9fafb', // gray-50
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e5e7eb',
  },
  // StatBox Styles
  statBox: {
    flexDirection: 'col',
    alignItems: 'center',
  },
  statCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0d9488', // teal-600
  },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280', // gray-500
  },
  detailsGrid: {
    gap: 16, // Requires React Native 0.71+
  },
  // Detail Item Styles
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6', // gray-100
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280', // gray-500
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937', // gray-800
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6', // gray-100
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827', // gray-900
  },
  // Department Card Styles
  departmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6', // gray-100
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  departmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f766e', // teal-700
  },
  departmentCount: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginTop: 4,
  },
  departmentBody: {
    // transition handling is done via LayoutAnimation
  },
  departmentDescription: {
    fontSize: 14,
    color: '#4b5563', // gray-600
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    lineHeight: 20,
  },
  doctorList: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 16,
  },
  // Doctor Card Styles
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccfbf1', // teal-100
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    marginRight: 16,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827', // gray-900
  },
  doctorQual: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginTop: 2,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  doctorExp: {
    fontSize: 12,
    color: '#9ca3af', // gray-400
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonActive: {
    backgroundColor: '#0d9488', // teal-600
  },
  bookButtonDisabled: {
    backgroundColor: '#ef4444', // red-500
    opacity: 0.8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;