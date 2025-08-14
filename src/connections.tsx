import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

export default function ConnectionsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  
  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const pendingConnections = useQuery(api.connections.getMyConnections, {
    userId: currentUserId,
    status: 'pending',
  });

  const acceptedConnections = useQuery(api.connections.getMyConnections, {
    userId: currentUserId,
    status: 'accepted',
  });

  const respondToConnection = useMutation(api.connections.respondToConnection);

  const handleAccept = async (connectionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await respondToConnection({
        connectionId: connectionId as any,
        response: 'accepted',
      });
    } catch (error) {
      console.error('Failed to accept connection:', error);
    }
  };

  const handleReject = async (connectionId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      await respondToConnection({
        connectionId: connectionId as any,
        response: 'rejected',
      });
    } catch (error) {
      console.error('Failed to reject connection:', error);
    }
  };

  const renderConnectionItem = ({ item }: { item: any }) => {
    const user = item.otherUser;
    if (!user) return null;

    return (
      <View style={styles.connectionCard}>
        <View style={styles.userImageContainer}>
          {user.profilePhoto ? (
            <Image 
              source={{ uri: 'https://via.placeholder.com/80x80' }} 
              style={styles.userImage}
            />
          ) : (
            <View style={[styles.userImage, styles.placeholderUserImage]}>
              <Ionicons name="person" size={32} color="#C7C7CC" />
            </View>
          )}
          {user.isVerified && (
            <View style={styles.verificationBadgeSmall}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            </View>
          )}
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.connectionName}>{user.name}</Text>
          <Text style={styles.connectionLocation}>
            {user.location.city}, {user.location.district}
          </Text>
          <View style={styles.connectionTypeContainer}>
            <Text style={styles.connectionTypeLabel}>
              {item.connectionType === 'friendship' ? 'Friendship' :
               item.connectionType === 'dating' ? 'Dating' : 'Casual'}
            </Text>
          </View>
          {user.isOnline && (
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          )}
        </View>

        {activeTab === 'pending' && !item.isInitiatedByMe && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={() => handleReject(item._id)}
            >
              <Ionicons name="close" size={20} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => handleAccept(item._id)}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'pending' && item.isInitiatedByMe && (
          <View style={styles.pendingIndicator}>
            <Text style={styles.pendingText}>Pending</Text>
            <Text style={styles.pendingTextOdia}>ଅପେକ୍ଷାରେ</Text>
          </View>
        )}
      </View>
    );
  };

  const currentConnections = activeTab === 'pending' ? pendingConnections : acceptedConnections;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
        <Text style={styles.headerTitleOdia}>ସଂଯୋଗ</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
          <Text style={[styles.tabTextOdia, activeTab === 'pending' && styles.activeTabTextOdia]}>
            ଅପେକ୍ଷାରେ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
            Connected
          </Text>
          <Text style={[styles.tabTextOdia, activeTab === 'accepted' && styles.activeTabTextOdia]}>
            ସଂଯୁକ୍ତ
          </Text>
        </TouchableOpacity>
      </View>

      {!currentConnections ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading connections...</Text>
        </View>
      ) : currentConnections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'pending' ? "hourglass-outline" : "people-outline"} 
            size={64} 
            color="#C7C7CC" 
          />
          <Text style={styles.emptyTitle}>
            {activeTab === 'pending' ? 'No pending requests' : 'No connections yet'}
          </Text>
          <Text style={styles.emptyTitleOdia}>
            {activeTab === 'pending' ? 'କୌଣସି ଅପେକ୍ଷାରତ ଅନୁରୋଧ ନାହିଁ' : 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସଂଯୋଗ ନାହିଁ'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'pending' 
              ? 'Connection requests will appear here' 
              : 'Start discovering people to make connections'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentConnections}
          renderItem={renderConnectionItem}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FF6B6B',
  },
  tabTextOdia: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 2,
  },
  activeTabTextOdia: {
    color: '#FF6B6B',
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
  listContainer: {
    padding: 20,
    gap: 16,
  },
  connectionCard: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderUserImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadgeSmall: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  connectionLocation: {
    fontSize: 14,
    color: '#8E8E93',
  },
  connectionTypeContainer: {
    alignSelf: 'flex-start',
  },
  connectionTypeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF6B6B',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  onlineText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingIndicator: {
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  pendingTextOdia: {
    fontSize: 10,
    color: '#C7C7CC',
  },
});