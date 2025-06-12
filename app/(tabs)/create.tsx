import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function Create() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const router = useRouter();
  const { user } = useUser();

  // Function to pick image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to handle post creation
  const handleCreatePost = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    try {
      // Logic for creating post will go here
      // For now just simulate success
      alert('Post created successfully!');
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity 
            onPress={handleCreatePost}
            style={[
              styles.shareButton,
              !selectedImage && styles.shareButtonDisabled
            ]}
            disabled={!selectedImage}
          >
            <Text style={[
              styles.shareButtonText,
              !selectedImage && styles.shareButtonTextDisabled
            ]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Image Selection Area */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.selectedImage}
            />
          ) : (
            <TouchableOpacity 
              style={styles.imagePlaceholder}
              onPress={pickImage}
            >
              <Ionicons name="image" size={40} color={COLORS.grey} />
              <Text style={styles.imagePlaceholderText}>Tap to select an image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Input */}
        <View style={styles.captionContainer}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: user?.imageUrl }} 
              style={styles.userImage}
            />
            <Text style={styles.username}>{user?.username}</Text>
          </View>
          <TextInput
            placeholder="Write a caption..."
            placeholderTextColor={COLORS.grey}
            multiline
            value={caption}
            onChangeText={setCaption}
            style={styles.captionInput}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'JetBrainsMono-Medium',
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
  },
  shareButtonText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  shareButtonTextDisabled: {
    color: COLORS.grey,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: COLORS.surface,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: COLORS.grey,
    marginTop: 12,
    fontSize: 16,
  },
  captionContainer: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  username: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  captionInput: {
    color: COLORS.white,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});