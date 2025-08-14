import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface LanguageToggleProps {
  currentLanguage: 'english' | 'odia';
  onLanguageChange: (language: 'english' | 'odia') => void;
}

export default function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  const handleLanguageChange = (language: 'english' | 'odia') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onLanguageChange(language);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          currentLanguage === 'english' && styles.activeLanguageButton
        ]}
        onPress={() => handleLanguageChange('english')}
      >
        <Text style={[
          styles.languageButtonText,
          currentLanguage === 'english' && styles.activeLanguageButtonText
        ]}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.languageButton,
          currentLanguage === 'odia' && styles.activeLanguageButton
        ]}
        onPress={() => handleLanguageChange('odia')}
      >
        <Text style={[
          styles.languageButtonText,
          currentLanguage === 'odia' && styles.activeLanguageButtonText
        ]}>
          ଓଡ଼ିଆ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 2,
    alignSelf: 'center',
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 70,
    alignItems: 'center',
  },
  activeLanguageButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeLanguageButtonText: {
    color: '#1C1C1E',
  },
});