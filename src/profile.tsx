import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  
  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const currentUser = useQuery(api.users.getUser, {
    userId: currentUserId,
  });

  const safetyTips = useQuery(api.safety.getSafetyTips, {});
  const emergencyContacts = useQuery(api.safety.getEmergencyContacts, {});

  const handleToggleSetting = (setting: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Update user settings
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {currentUser.profilePhoto ? (
              <Image 
                source={{ uri: 'https://via.placeholder.com/120x120' }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Ionicons name="person" size={48} color="#C7C7CC" />
              </View>
            )}
            {currentUser.isVerified && (
              <View style={styles.verificationBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              </View>
            )}
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileAge}>{currentUser.age} years old</Text>
          <Text style={styles.profileLocation}>
            {currentUser.location.city}, {currentUser.location.district}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.sectionTitleOdia}>ମୋ ବିଷୟରେ</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{currentUser.bio}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.sectionTitleOdia}>ଆଗ୍ରହ</Text>
          <View style={styles.interestsTags}>
            {currentUser.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addInterestTag}>
              <Ionicons name="add" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Settings</Text>
          <Text style={styles.sectionTitleOdia}>ସୁରକ୍ଷା ସେଟିଂସ</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Share Location</Text>
              <Text style={styles.settingLabelOdia}>ଅବସ୍ଥାନ ଅଂଶୀଦାର କରନ୍ତୁ</Text>
            </View>
            <Switch
              value={currentUser.safetySettings.shareLocation}
              onValueChange={() => handleToggleSetting('shareLocation')}
              trackColor={{ false: '#E5E5EA', true: '#FF6B6B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Allow Messages</Text>
              <Text style={styles.settingLabelOdia}>ବାର୍ତ୍ତା ଅନୁମତି ଦିଅନ୍ତୁ</Text>
            </View>
            <Switch
              value={currentUser.safetySettings.allowMessages}
              onValueChange={() => handleToggleSetting('allowMessages')}
              trackColor={{ false: '#E5E5EA', true: '#FF6B6B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Require Verification</Text>
              <Text style={styles.settingLabelOdia}>ଯାଞ୍ଚ ଆବଶ୍ୟକ</Text>
            </View>
            <Switch
              value={currentUser.safetySettings.requireVerification}
              onValueChange={() => handleToggleSetting('requireVerification')}
              trackColor={{ false: '#E5E5EA', true: '#FF6B6B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.safetyTipsButton}
          onPress={() => setShowSafetyTips(!showSafetyTips)}
        >
          <View style={styles.safetyTipsHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#34C759" />
            <Text style={styles.safetyTipsTitle}>Safety Tips</Text>
            <Text style={styles.safetyTipsTitleOdia}>ସୁରକ୍ଷା ଟିପ୍ସ</Text>
            <Ionicons 
              name={showSafetyTips ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#8E8E93" 
            />
          </View>
        </TouchableOpacity>

        {showSafetyTips && safetyTips && (
          <View style={styles.safetyTipsContainer}>
            {safetyTips.map((tip) => (
              <View key={tip.id} style={styles.safetyTip}>
                <Text style={styles.safetyTipTitle}>{tip.title}</Text>
                <Text style={styles.safetyTipTitleOdia}>{tip.titleOdia}</Text>
                <Text style={styles.safetyTipDescription}>{tip.description}</Text>
                <Text style={styles.safetyTipDescriptionOdia}>{tip.descriptionOdia}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionTitleOdia}>ଜରୁରୀକାଳୀନ ସମ୍ପର୍କ</Text>
          
          {emergencyContacts?.map((contact, index) => (
            <TouchableOpacity key={index} style={styles.emergencyContact}>
              <View style={styles.emergencyContactInfo}>
                <Text style={styles.emergencyContactName}>{contact.name}</Text>
                <Text style={styles.emergencyContactNameOdia}>{contact.nameOdia}</Text>
              </View>
              <View style={styles.emergencyContactNumber}>
                <Text style={styles.emergencyNumber}>{contact.number}</Text>
                <Ionicons name="call" size={20} color="#34C759" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  profileAge: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  profileLocation: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  sectionTitleOdia: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: -8,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bio: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  editButton: {
    padding: 4,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  addInterestTag: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  settingLabelOdia: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  safetyTipsButton: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  safetyTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  safetyTipsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  safetyTipsTitleOdia: {
    fontSize: 14,
    color: '#8E8E93',
  },
  safetyTipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  safetyTip: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  safetyTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  safetyTipTitleOdia: {
    fontSize: 14,
    fontWeight: '500',
    color: '#166534',
  },
  safetyTipDescription: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  safetyTipDescriptionOdia: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },
  emergencyContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  emergencyContactNameOdia: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 2,
  },
  emergencyContactNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  bottomSpacer: {
    height: 40,
  },
});