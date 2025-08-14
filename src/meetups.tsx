import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

const CATEGORIES = [
  { key: 'all', label: 'All', labelOdia: 'ସବୁ', icon: 'apps-outline' },
  { key: 'cultural', label: 'Cultural', labelOdia: 'ସାଂସ୍କୃତିକ', icon: 'library-outline' },
  { key: 'food', label: 'Food', labelOdia: 'ଖାଦ୍ୟ', icon: 'restaurant-outline' },
  { key: 'sports', label: 'Sports', labelOdia: 'କ୍ରୀଡ଼ା', icon: 'football-outline' },
  { key: 'social', label: 'Social', labelOdia: 'ସାମାଜିକ', icon: 'people-outline' },
  { key: 'religious', label: 'Religious', labelOdia: 'ଧାର୍ମିକ', icon: 'flower-outline' },
];

export default function MeetupsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const upcomingMeetups = useQuery(api.meetups.getUpcomingMeetups, {
    category: selectedCategory === 'all' ? undefined : selectedCategory as any,
    limit: 20,
  });

  const joinMeetup = useMutation(api.meetups.joinMeetup);

  const handleJoinMeetup = async (meetupId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await joinMeetup({
        meetupId: meetupId as any,
        userId: currentUserId,
      });
    } catch (error) {
      console.error('Failed to join meetup:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.key && styles.activeCategoryButton
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.key ? '#FFFFFF' : '#FF6B6B'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.key && styles.activeCategoryText
      ]}>
        {item.label}
      </Text>
      <Text style={[
        styles.categoryTextOdia,
        selectedCategory === item.key && styles.activeCategoryTextOdia
      ]}>
        {item.labelOdia}
      </Text>
    </TouchableOpacity>
  );

  const renderMeetupItem = ({ item }: { item: any }) => {
    const isJoined = item.currentParticipants.includes(currentUserId);
    const isFull = item.currentParticipants.length >= item.maxParticipants;
    
    return (
      <View style={styles.meetupCard}>
        <View style={styles.meetupHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {CATEGORIES.find(cat => cat.key === item.category)?.label || item.category}
            </Text>
          </View>
          {item.safetyVerified && (
            <View style={styles.safetyBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#34C759" />
            </View>
          )}
        </View>

        <Text style={styles.meetupTitle}>{item.title}</Text>
        <Text style={styles.meetupDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.meetupDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>
              {formatDate(item.dateTime)} at {formatTime(item.dateTime)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{item.location.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>
              {item.currentParticipants.length}/{item.maxParticipants} joined
            </Text>
          </View>
        </View>

        <View style={styles.organizerInfo}>
          <Text style={styles.organizerLabel}>Organized by:</Text>
          <Text style={styles.organizerName}>{item.organizer?.name}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            isJoined && styles.joinedButton,
            isFull && !isJoined && styles.fullButton,
          ]}
          onPress={() => !isJoined && !isFull && handleJoinMeetup(item._id)}
          disabled={isJoined || isFull}
        >
          <Text style={[
            styles.joinButtonText,
            isJoined && styles.joinedButtonText,
            isFull && !isJoined && styles.fullButtonText,
          ]}>
            {isJoined ? 'Joined' : isFull ? 'Full' : 'Join Meetup'}
          </Text>
          <Text style={[
            styles.joinButtonTextOdia,
            isJoined && styles.joinedButtonTextOdia,
            isFull && !isJoined && styles.fullButtonTextOdia,
          ]}>
            {isJoined ? 'ଯୋଗ ଦେଇଛନ୍ତି' : isFull ? 'ପୂର୍ଣ୍ଣ' : 'ଯୋଗ ଦିଅନ୍ତୁ'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meetups</Text>
        <Text style={styles.headerTitleOdia}>ସାକ୍ଷାତ</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {!upcomingMeetups ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading meetups...</Text>
        </View>
      ) : upcomingMeetups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No meetups found</Text>
          <Text style={styles.emptyTitleOdia}>କୌଣସି ସାକ୍ଷାତ ମିଳିଲା ନାହିଁ</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to create a meetup in your area
          </Text>
          <Text style={styles.emptySubtitleOdia}>
            ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ପ୍ରଥମ ସାକ୍ଷାତ ସୃଷ୍ଟି କରନ୍ତୁ
          </Text>
        </View>
      ) : (
        <FlatList
          data={upcomingMeetups}
          renderItem={renderMeetupItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  createButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    minWidth: 80,
    gap: 4,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  categoryTextOdia: {
    fontSize: 10,
    color: '#FF6B6B',
  },
  activeCategoryTextOdia: {
    color: '#FFFFFF',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  emptyTitleOdia: {
    fontSize: 16,
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
  listContainer: {
    padding: 20,
    gap: 16,
  },
  meetupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  meetupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  safetyBadge: {
    backgroundColor: '#F0FDF4',
    padding: 4,
    borderRadius: 8,
  },
  meetupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  meetupDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  meetupDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  organizerLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  joinButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 2,
  },
  joinedButton: {
    backgroundColor: '#34C759',
  },
  fullButton: {
    backgroundColor: '#8E8E93',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },
  fullButtonText: {
    color: '#FFFFFF',
  },
  joinButtonTextOdia: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  joinedButtonTextOdia: {
    color: '#FFFFFF',
  },
  fullButtonTextOdia: {
    color: '#FFFFFF',
  },
});