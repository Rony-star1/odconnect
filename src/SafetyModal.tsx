import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SafetyModalProps {
  visible: boolean;
  onClose: () => void;
  emergencyContacts?: Array<{
    name: string;
    nameOdia: string;
    number: string;
    type: string;
  }>;
}

export default function SafetyModal({ visible, onClose, emergencyContacts }: SafetyModalProps) {
  const handleEmergencyCall = (number: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Safety Center</Text>
          <Text style={styles.titleOdia}>ସୁରକ୍ଷା କେନ୍ଦ୍ର</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.emergencySection}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color="#FF3B30" />
              <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
              <Text style={styles.emergencyTitleOdia}>ଜରୁରୀକାଳୀନ ସମ୍ପର୍କ</Text>
            </View>
            
            {emergencyContacts?.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyContact}
                onPress={() => handleEmergencyCall(contact.number)}
              >
                <View style={styles.emergencyContactInfo}>
                  <Text style={styles.emergencyContactName}>{contact.name}</Text>
                  <Text style={styles.emergencyContactNameOdia}>{contact.nameOdia}</Text>
                </View>
                <View style={styles.emergencyContactAction}>
                  <Text style={styles.emergencyNumber}>{contact.number}</Text>
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Quick Safety Tips</Text>
            <Text style={styles.tipsTitleOdia}>ଦ୍ରୁତ ସୁରକ୍ଷା ଟିପ୍ସ</Text>
            
            <View style={styles.tip}>
              <Ionicons name="location" size={20} color="#007AFF" />
              <View style={styles.tipContent}>
                <Text style={styles.tipText}>Share your live location with trusted contacts</Text>
                <Text style={styles.tipTextOdia}>ବିଶ୍ୱସ୍ତ ସମ୍ପର୍କ ସହିତ ଆପଣଙ୍କ ଲାଇଭ ଅବସ୍ଥାନ ଅଂଶୀଦାର କରନ୍ତୁ</Text>
              </View>
            </View>

            <View style={styles.tip}>
              <Ionicons name="people" size={20} color="#34C759" />
              <View style={styles.tipContent}>
                <Text style={styles.tipText}>Meet in public places with good lighting</Text>
                <Text style={styles.tipTextOdia}>ଭଲ ଆଲୋକ ସହିତ ସାର୍ବଜନୀନ ସ୍ଥାନରେ ସାକ୍ଷାତ କରନ୍ତୁ</Text>
              </View>
            </View>

            <View style={styles.tip}>
              <Ionicons name="time" size={20} color="#FF9500" />
              <View style={styles.tipContent}>
                <Text style={styles.tipText}>Set a check-in time with friends or family</Text>
                <Text style={styles.tipTextOdia}>ବନ୍ଧୁ କିମ୍ବା ପରିବାର ସହିତ ଚେକ୍-ଇନ୍ ସମୟ ସେଟ୍ କରନ୍ତୁ</Text>
              </View>
            </View>

            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color="#8E4EC6" />
              <View style={styles.tipContent}>
                <Text style={styles.tipText}>Trust your instincts - leave if uncomfortable</Text>
                <Text style={styles.tipTextOdia}>ଆପଣଙ୍କ ଅନୁଭବକୁ ବିଶ୍ୱାସ କରନ୍ତୁ - ଅସହଜ ଲାଗିଲେ ଚାଲିଯାଆନ୍ତୁ</Text>
              </View>
            </View>
          </View>

          <View style={styles.reportSection}>
            <TouchableOpacity style={styles.reportButton}>
              <Ionicons name="flag" size={20} color="#FF3B30" />
              <Text style={styles.reportButtonText}>Report Safety Concern</Text>
              <Text style={styles.reportButtonTextOdia}>ସୁରକ୍ଷା ଚିନ୍ତା ରିପୋର୍ଟ କରନ୍ତୁ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  titleOdia: {
    fontSize: 14,
    color: '#8E8E93',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emergencySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    gap: 16,
  },
  emergencyHeader: {
    alignItems: 'center',
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  emergencyTitleOdia: {
    fontSize: 14,
    color: '#FF3B30',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emergencyContactNameOdia: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  emergencyContactAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    gap: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  tipsTitleOdia: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  tipTextOdia: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  reportSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  reportButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  reportButtonTextOdia: {
    fontSize: 12,
    color: '#DC2626',
  },
});