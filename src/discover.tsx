import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function DiscoverScreen() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [filters, setFilters] = useState({
    district: '',
    ageRange: { min: 18, max: 35 },
    lookingFor: 'friendship' as const,
  });

  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const discoveredUsers = useQuery(api.users.discoverUsers, {
    currentUserId,
    district: filters.district || undefined,
    ageRange: filters.ageRange,
    lookingFor: filters.lookingFor,
    limit: 10,
  });

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // TODO: Send connection request
    nextUser();
  };

  const handlePass = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    nextUser();
  };

  const nextUser = () => {
    if (discoveredUsers && currentUserIndex < discoveredUsers.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const currentUser = discoveredUsers?.[currentUserIndex];

  if (!discoveredUsers) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Discovering people near you...</Text>
          <Text style={styles.loadingTextOdia}>ଆପଣଙ୍କ ନିକଟରେ ଲୋକଙ୍କୁ ଖୋଜୁଛି...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#FF6B6B" />
          <Text style={styles.emptyTitle}>No more people to discover</Text>
          <Text style={styles.emptyTitleOdia}>ଆଉ କେହି ମିଳିଲେ ନାହିଁ</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters or check back later
          </Text>
          <Text style={styles.emptySubtitleOdia}>
            ଆପଣଙ୍କ ଫିଲ୍ଟର ବଦଳାନ୍ତୁ କିମ୍ବା ପରେ ଦେଖନ୍ତୁ
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerTitleOdia}>ଆବିଷ୍କାର</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            {currentUser.profilePhoto ? (
              <Image 
                source={{ uri: 'https://via.placeholder.com/400x500' }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Ionicons name="person" size={80} color="#C7C7CC" />
              </View>
            )}
            
            <View style={styles.verificationBadge}>
              {currentUser.isVerified && (
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              )}
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userAge}>{currentUser.age}</Text>
            </View>
            
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#8E8E93" />
              <Text style={styles.location}>
                {currentUser.location.city}, {currentUser.location.district}
              </Text>
            </View>

            <View style={styles.lookingForContainer}>
              <Text style={styles.lookingForLabel}>Looking for:</Text>
              <View style={styles.lookingForBadge}>
                <Text style={styles.lookingForText}>
                  {currentUser.lookingFor === 'friendship' ? 'Friendship' :
                   currentUser.lookingFor === 'dating' ? 'Dating' :
                   currentUser.lookingFor === 'casual' ? 'Casual' : 'Serious'}
                </Text>
              </View>
            </View>

            <Text style={styles.bio}>{currentUser.bio}</Text>

            <View style={styles.interestsContainer}>
              <Text style={styles.interestsLabel}>Interests:</Text>
              <View style={styles.interestsTags}>
                {currentUser.interests.slice(0, 4).map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.languageContainer}>
              <Ionicons name="language-outline" size={16} color="#8E8E93" />
              <Text style={styles.languageText}>
                {currentUser.language === 'odia' ? 'ଓଡ଼ିଆ' :
                 currentUser.language === 'english' ? 'English' : 'ଓଡ଼ିଆ & English'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]}
            onPress={handlePass}
          >
            <Ionicons name="close" size={32} color="#FF3B30" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Ionicons name="heart" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.safetyReminder}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#34C759" />
          <Text style={styles.safetyText}>
            Remember to meet in public places and trust your instincts
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerTitleOdia: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: -4,
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  loadingTextOdia: {
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  emptyTitleOdia: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptySubtitleOdia: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: CARD_WIDTH,
    height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  placeholderImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  userInfo: {
    padding: 20,
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  userAge: {
    fontSize: 20,
    color: '#8E8E93',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
  },
  lookingForContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lookingForLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  lookingForBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lookingForText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bio: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  interestsContainer: {
    gap: 8,
  },
  interestsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 30,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
  safetyReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    marginBottom: 40,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
});