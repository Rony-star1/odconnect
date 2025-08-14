import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState<'english' | 'odia'>('english');
  const flatListRef = useRef<FlatList>(null);
  
  // Mock current user ID - in real app this would come from auth
  const currentUserId = "k17d9g8h2j5f6a3b1c2d3e4f" as any;

  const otherUser = useQuery(api.users.getUser, {
    userId: userId as any,
  });

  const conversation = useQuery(api.messages.getConversation, {
    userId1: currentUserId,
    userId2: userId as any,
    limit: 50,
  });

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  useEffect(() => {
    if (conversation && conversation.length > 0) {
      const conversationId = [currentUserId, userId].sort().join("-");
      markAsRead({
        conversationId,
        userId: currentUserId,
      });
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await sendMessage({
        senderId: currentUserId,
        receiverId: userId as any,
        content: message.trim(),
        messageType: 'text',
        language,
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === currentUserId;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatTime(item._creationTime)}
          </Text>
        </View>
      </View>
    );
  };

  if (!otherUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{otherUser.name}</Text>
            <View style={styles.statusContainer}>
              {otherUser.isOnline ? (
                <>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </>
              ) : (
                <Text style={styles.offlineText}>
                  Last seen {formatTime(otherUser.lastSeen)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="call-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Ionicons name="videocam-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={conversation || []}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'english' && styles.activeLanguageButton
              ]}
              onPress={() => setLanguage('english')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'english' && styles.activeLanguageButtonText
              ]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'odia' && styles.activeLanguageButton
              ]}
              onPress={() => setLanguage('odia')}
            >
              <Text style={[
                styles.languageButtonText,
                language === 'odia' && styles.activeLanguageButtonText
              ]}>
                ଓଡ଼
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder={language === 'odia' ? "ବାର୍ତ୍ତା ଲେଖନ୍ତୁ..." : "Type a message..."}
              multiline
              maxLength={500}
            />
            
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach-outline" size={24} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.voiceButton}>
                <Ionicons name="mic-outline" size={24} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !message.trim() && styles.disabledSendButton
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={message.trim() ? "#FFFFFF" : "#C7C7CC"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
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
  offlineText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 4,
  },
  myMessageBubble: {
    backgroundColor: '#FF6B6B',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1C1C1E',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: '#FFFFFF',
    opacity: 0.8,
    alignSelf: 'flex-end',
  },
  otherMessageTime: {
    color: '#8E8E93',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  languageToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 2,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  activeLanguageButton: {
    backgroundColor: '#FFFFFF',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeLanguageButtonText: {
    color: '#1C1C1E',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  voiceButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 10,
  },
  disabledSendButton: {
    backgroundColor: '#E5E5EA',
  },
});