import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={80} color="#FF6B6B" />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Odisha Connect</Text>
          <Text style={styles.titleOdia}>ଓଡ଼ିଶା ସଂଯୋଗ</Text>
          <Text style={styles.subtitle}>Sahayog</Text>
          <Text style={styles.subtitleOdia}>ସହାୟୋଗ</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Connect with people across Odisha for meaningful relationships, friendships, and cultural experiences
          </Text>
          <Text style={styles.descriptionOdia}>
            ଅର୍ଥପୂର୍ଣ୍ଣ ସମ୍ପର୍କ, ବନ୍ଧୁତା ଏବଂ ସାଂସ୍କୃତିକ ଅନୁଭବ ପାଇଁ ଓଡ଼ିଶାର ଲୋକଙ୍କ ସହିତ ସଂଯୋଗ କରନ୍ତୁ
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <Text style={styles.featureText}>Safe & Verified</Text>
            <Text style={styles.featureTextOdia}>ସୁରକ୍ଷିତ ଏବଂ ଯାଞ୍ଚିତ</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="language" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Odia Support</Text>
            <Text style={styles.featureTextOdia}>ଓଡ଼ିଆ ସମର୍ଥନ</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="people" size={24} color="#FF9500" />
            <Text style={styles.featureText}>Local Community</Text>
            <Text style={styles.featureTextOdia}>ସ୍ଥାନୀୟ ସମ୍ପ୍ରଦାୟ</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Text style={styles.getStartedTextOdia}>ଆରମ୍ଭ କରନ୍ତୁ</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
        <Text style={styles.termsTextOdia}>
          ଜାରି ରଖିବା ଦ୍ୱାରା, ଆପଣ ଆମର ସେବା ସର୍ତ୍ତ ଏବଂ ଗୋପନୀୟତା ନୀତିରେ ସହମତ ହୁଅନ୍ତି
        </Text>
      </View>
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
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 40,
  },
  iconContainer: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  titleOdia: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitleOdia: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  descriptionContainer: {
    gap: 12,
  },
  description: {
    fontSize: 18,
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 26,
  },
  descriptionOdia: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  featureTextOdia: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  getStartedTextOdia: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsTextOdia: {
    fontSize: 10,
    color: '#C7C7CC',
    textAlign: 'center',
    lineHeight: 14,
  },
});