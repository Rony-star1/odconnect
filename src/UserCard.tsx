import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface User {
  _id: string;
  name: string;
  age: number;
  location: {
    city: string;
    district: string;
  };
  bio: string;
  interests: string[];
  lookingFor: string;
  language: string;
  isVerified: boolean;
  isOnline: boolean;
  profilePhoto?: string;
}

interface UserCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onViewProfile: () => void;
}

export default function UserCard({ user, onLike, onPass, onViewProfile }: UserCardProps) {
  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLike();
  };

  const handlePass = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPass();
  };

  const getLookingForText = (lookingFor: string) => {
    switch (lookingFor) {
      case 'friendship': return { en: 'Friendship', od: 'ବନ୍ଧୁତା' };
      case 'dating': return { en: 'Dating', od: 'ଡେଟିଂ' };
      case 'casual': return { en: 'Casual', od: 'ସାଧାରଣ' };
      case 'serious': return { en: 'Serious', od: 'ଗମ୍ଭୀର' };
      default: return { en: lookingFor, od: lookingFor };
    }
  };

  const getLanguageText = (language: string) => {
    switch (language) {
      case 'odia': return 'ଓଡ଼ିଆ';
      case 'english': return 'English';
      case 'both': return 'ଓଡ଼ିଆ & English';
      default: return language;
    }
  };

  const lookingForText = getLookingForText(user.lookingFor);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onViewProfile}>
        <View style={styles.imageContainer}>
          {user.profilePhoto ? (
            <Image 
              source={{ uri: user.profilePhoto }} 
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Ionicons name="person" size={80} color="#C7C7CC" />
            </View>
          )}
          
          <View style={styles.badges}>
            {user.isVerified && (
              <View style={styles.verificationBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              </View>
            )}
            {user.isOnline && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
              </View>
            )}
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userAge}>{user.age}</Text>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#8E8E93" />
            <Text style={styles.location}>
              {user.location.city}, {user.location.district}
            </Text>
          </View>

          <View style={styles.lookingForContainer}>
            <Text style={styles.lookingForLabel}>Looking for:</Text>
            <View style={styles.lookingForBadge}>
              <Text style={styles.lookingForText}>{lookingForText.en}</Text>
            </View>
          </View>

          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>

          <View style={styles.interestsContainer}>
            <View style={styles.interestsTags}>
              {user.interests.slice(0, 3).map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
              {user.interests.length > 3 && (
                <View style={styles.moreInterestsTag}>
                  <Text style={styles.moreInterestsText}>+{user.interests.length - 3}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.languageContainer}>
            <Ionicons name="language-outline" size={14} color="#8E8E93" />
            <Text style={styles.languageText}>
              {getLanguageText(user.language)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={handlePass}
        >
          <Ionicons name="close" size={28} color="#FF3B30" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.superLikeButton]}
        >
          <Ionicons name="star" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
        >
          <Ionicons name="heart" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badges: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  verificationBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  quickActions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  quickActionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
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
    fontSize: 14,
    color: '#8E8E93',
  },
  lookingForContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lookingForLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lookingForBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lookingForText: {
    fontSize: 11,
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
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    color: '#1C1C1E',
  },
  moreInterestsTag: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreInterestsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 30,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  superLikeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  likeButton: {
    backgroundColor: '#FF6B6B',
  },
});