import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const DISTRICTS = [
  'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh',
  'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur',
  'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar',
  'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh',
  'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
];

const INTERESTS = [
  'Music', 'Dance', 'Movies', 'Books', 'Travel', 'Food', 'Sports', 'Art',
  'Photography', 'Cooking', 'Yoga', 'Meditation', 'Technology', 'Nature',
  'Festivals', 'Temple Visits', 'Classical Music', 'Folk Dance', 'Cricket',
  'Football', 'Badminton', 'Swimming', 'Hiking', 'Gardening'
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    district: '',
    city: '',
    bio: '',
    interests: [] as string[],
    lookingFor: '',
    language: '',
  });

  const createUser = useMutation(api.users.createUser);

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setStep(step - 1);
  };

  const handleInterestToggle = (interest: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender as any,
        district: formData.district,
        city: formData.city,
        bio: formData.bio,
        interests: formData.interests,
        lookingFor: formData.lookingFor as any,
        language: formData.language as any,
      });
      
      router.replace('/(tabs)/discover');
    } catch (error) {
      console.error('Failed to create user:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.age && formData.gender;
      case 2:
        return formData.district && formData.city;
      case 3:
        return formData.bio && formData.interests.length > 0;
      case 4:
        return formData.lookingFor && formData.language;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepTitleOdia}>ମୂଳ ତଥ୍ୟ</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <Text style={styles.inputLabelOdia}>ପୂର୍ଣ୍ଣ ନାମ</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <Text style={styles.inputLabelOdia}>ଇମେଲ</Text>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Age</Text>
        <Text style={styles.inputLabelOdia}>ବୟସ</Text>
        <TextInput
          style={styles.textInput}
          value={formData.age}
          onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
          placeholder="Enter your age"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Gender</Text>
        <Text style={styles.inputLabelOdia}>ଲିଙ୍ଗ</Text>
        <View style={styles.optionsContainer}>
          {['male', 'female', 'other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.optionButton,
                formData.gender === gender && styles.selectedOption
              ]}
              onPress={() => setFormData(prev => ({ ...prev, gender }))}
            >
              <Text style={[
                styles.optionText,
                formData.gender === gender && styles.selectedOptionText
              ]}>
                {gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Location</Text>
      <Text style={styles.stepTitleOdia}>ଅବସ୍ଥାନ</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>District</Text>
        <Text style={styles.inputLabelOdia}>ଜିଲ୍ଲା</Text>
        <ScrollView style={styles.districtSelector} showsVerticalScrollIndicator={false}>
          {DISTRICTS.map((district) => (
            <TouchableOpacity
              key={district}
              style={[
                styles.districtOption,
                formData.district === district && styles.selectedDistrict
              ]}
              onPress={() => setFormData(prev => ({ ...prev, district }))}
            >
              <Text style={[
                styles.districtText,
                formData.district === district && styles.selectedDistrictText
              ]}>
                {district}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>City/Town</Text>
        <Text style={styles.inputLabelOdia}>ସହର/ଟାଉନ</Text>
        <TextInput
          style={styles.textInput}
          value={formData.city}
          onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
          placeholder="Enter your city or town"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>About You</Text>
      <Text style={styles.stepTitleOdia}>ଆପଣଙ୍କ ବିଷୟରେ</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Bio</Text>
        <Text style={styles.inputLabelOdia}>ପରିଚୟ</Text>
        <TextInput
          style={[styles.textInput, styles.bioInput]}
          value={formData.bio}
          onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
          placeholder="Tell others about yourself..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Interests (Select at least 3)</Text>
        <Text style={styles.inputLabelOdia}>ଆଗ୍ରହ (ଅତି କମରେ ୩ଟି ବାଛନ୍ତୁ)</Text>
        <View style={styles.interestsGrid}>
          {INTERESTS.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestButton,
                formData.interests.includes(interest) && styles.selectedInterest
              ]}
              onPress={() => handleInterestToggle(interest)}
            >
              <Text style={[
                styles.interestButtonText,
                formData.interests.includes(interest) && styles.selectedInterestText
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preferences</Text>
      <Text style={styles.stepTitleOdia}>ପସନ୍ଦ</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Looking For</Text>
        <Text style={styles.inputLabelOdia}>ଖୋଜୁଛନ୍ତି</Text>
        <View style={styles.optionsContainer}>
          {[
            { key: 'friendship', label: 'Friendship', labelOdia: 'ବନ୍ଧୁତା' },
            { key: 'dating', label: 'Dating', labelOdia: 'ଡେଟିଂ' },
            { key: 'casual', label: 'Casual', labelOdia: 'ସାଧାରଣ' },
            { key: 'serious', label: 'Serious', labelOdia: 'ଗମ୍ଭୀର' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.preferenceButton,
                formData.lookingFor === option.key && styles.selectedPreference
              ]}
              onPress={() => setFormData(prev => ({ ...prev, lookingFor: option.key }))}
            >
              <Text style={[
                styles.preferenceText,
                formData.lookingFor === option.key && styles.selectedPreferenceText
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.preferenceTextOdia,
                formData.lookingFor === option.key && styles.selectedPreferenceTextOdia
              ]}>
                {option.labelOdia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Language Preference</Text>
        <Text style={styles.inputLabelOdia}>ଭାଷା ପସନ୍ଦ</Text>
        <View style={styles.optionsContainer}>
          {[
            { key: 'odia', label: 'Odia Only', labelOdia: 'କେବଳ ଓଡ଼ିଆ' },
            { key: 'english', label: 'English Only', labelOdia: 'କେବଳ ଇଂରାଜୀ' },
            { key: 'both', label: 'Both', labelOdia: 'ଦୁଇଟି' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.languageButton,
                formData.language === option.key && styles.selectedLanguage
              ]}
              onPress={() => setFormData(prev => ({ ...prev, language: option.key }))}
            >
              <Text style={[
                styles.languageText,
                formData.language === option.key && styles.selectedLanguageText
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.languageTextOdia,
                formData.language === option.key && styles.selectedLanguageTextOdia
              ]}>
                {option.labelOdia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={step > 1 ? handleBack : undefined}
          disabled={step === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={step > 1 ? "#1C1C1E" : "#C7C7CC"} 
          />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <Text style={styles.stepIndicator}>Step {step} of 4</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
          </View>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isStepValid() && styles.disabledButton
          ]}
          onPress={step === 4 ? handleComplete : handleNext}
          disabled={!isStepValid()}
        >
          <Text style={[
            styles.nextButtonText,
            !isStepValid() && styles.disabledButtonText
          ]}>
            {step === 4 ? 'Complete Profile' : 'Next'}
          </Text>
          <Text style={[
            styles.nextButtonTextOdia,
            !isStepValid() && styles.disabledButtonTextOdia
          ]}>
            {step === 4 ? 'ପ୍ରୋଫାଇଲ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ' : 'ପରବର୍ତ୍ତୀ'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 32,
    gap: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  stepTitleOdia: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: -16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  inputLabelOdia: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: -4,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  districtSelector: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
  },
  districtOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  selectedDistrict: {
    backgroundColor: '#FFF5F5',
  },
  districtText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  selectedDistrictText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedInterest: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  interestButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  preferenceButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  selectedPreference: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedPreferenceText: {
    color: '#FFFFFF',
  },
  preferenceTextOdia: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectedPreferenceTextOdia: {
    color: '#FFFFFF',
  },
  languageButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  selectedLanguage: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedLanguageText: {
    color: '#FFFFFF',
  },
  languageTextOdia: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectedLanguageTextOdia: {
    color: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  nextButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#8E8E93',
  },
  nextButtonTextOdia: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  disabledButtonTextOdia: {
    color: '#8E8E93',
  },
});