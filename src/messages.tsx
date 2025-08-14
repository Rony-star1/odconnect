import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router } from 'expo-router';

export default function MessagesScreen() {
  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const conversations = useQuery(api.messages.getConversationsList, {
    userId: currentUserId,
  });

  const unreadCount = useQuery(api.messages.getUnreadCount, {
    userId: currentUserId,
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderConversationItem = ({ item }: { item: any }) => {
    const user = item.otherUser;
    if (!user) return null;

    return (
      <TouchableOpacity 
        style={styles.conversationCard}
        onPress={() => router.push(`/chat/${user._id}`)}
      >
        <View style={styles.userImageContainer}>
          {user.profilePhoto ? (
            <Image 
              source={{ uri: 'https://via.placeholder.com/60x60' }} 
              style={styles.userImage}
            />
          ) : (
            <View style={[styles.userImage, styles.placeholderUserImage]}>
              <Ionicons name="person" size={24} color="#C7C7CC" />
            </View>
          )}
          {user.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
        </View>

        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.timestamp}>
              {formatTime(item._creationTime)}
            </Text>
          </View>
          
          <View style={styles.messagePreview}>
            <Text 
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.messageType === 'text' ? item.content :
               item.messageType === 'voice' ? '🎵 Voice message' :
               item.messageType === 'image' ? '📷 Photo' : '📍 Location'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 9 ? '9+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerTitleOdia}>ବାର୍ତ୍ତା</Text>
        </View>
        {unreadCount !== undefined && unreadCount > 0 && (
          <View style={styles.totalUnreadBadge}>
            <Text style={styles.totalUnreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {!conversations ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyTitleOdia}>ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ବାର୍ତ୍ତାଳାପ ନାହିଁ</Text>
          <Text style={styles.emptySubtitle}>
            Connect with people to start chatting
          </Text>
          <Text style={styles.emptySubtitleOdia}>
            ଚାଟ୍ ଆରମ୍ଭ କରିବା ପାଇଁ ଲୋକଙ୍କ ସହିତ ସଂଯୋଗ କରନ୍ତୁ
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
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
  totalUnreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  totalUnreadText: {
    fontSize: 12,
    fontWeight: 'bold',
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
    gap: 12,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userImageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderUserImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationDetails: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});