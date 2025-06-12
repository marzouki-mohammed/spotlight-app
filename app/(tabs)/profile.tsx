import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

// Exemple de posts pour la démo
const userPosts = [
  { id: '1', image: require('../../assets/images/waterfall.jpg') },
  { id: '2', image: require('../../assets/images/waterfall.jpg') },
];

interface UserProfile {
  _id: string;
  username: string;
  fullname: string;
  bio?: string;
  image: string;
  posts: any[];  followers: number;
  following: number;
  clerkId: string;
}

export default function Profile() {
  const { user } = useUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [name, setName] = useState(user?.fullName || '');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const profile = useQuery(api.profile.getProfile, { 
    clerkId: user?.id || '' 
  });
  
  const updateProfile = useMutation(api.profile.updateProfile);
  const followUser = useMutation(api.follows.followUser);
  const unfollowUser = useMutation(api.follows.unfollowUser);
  const isFollowingQuery = useQuery(api.follows.isFollowing, {
    followerId: user?.id || '',
    followingId: profile?.clerkId || ''
  });

  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if (profile) {
      setName(profile.fullname);
      setBio(profile.bio || '');
    }
  }, [profile]);

  useEffect(() => {
    setIsFollowing(isFollowingQuery || false);
  }, [isFollowingQuery]);
  const handleSaveChanges = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      await updateProfile({
        clerkId: user.id,
        fullname: name,
        bio: bio || undefined,
      });
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowPress = async () => {
    if (!user?.id || !profile?.clerkId) return;
    
    try {
      setIsLoading(true);
      if (isFollowing) {
        await unfollowUser({
          followerId: user.id,
          followingId: profile.clerkId
        });
        setIsFollowing(false);
      } else {
        await followUser({
          followerId: user.id,
          followingId: profile.clerkId
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPost = ({ item, index }: { item: any, index: number }) => (
    <View style={[
      styles.postContainer,
      index % 2 === 0 && styles.leftPost
    ]}>
      <Image source={item.image} style={styles.postImage} />
    </View>
  );

  return (
    <View style={styles.container}>      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{profile?.username || 'username'}</Text>
        <TouchableOpacity onPress={async () => {
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(`spotlight://profile/${profile?.clerkId}`, {
              dialogTitle: `Check out ${profile?.fullname}'s profile`,
            });
          }
        }}>
          <Ionicons name="share-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {/* Avatar and Stats */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarLetter}>
                {(user?.username?.[0] || 'U').toUpperCase()}
              </Text>
            </View>        <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile?.posts?.length || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile?.followers || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile?.following || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Name and Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.fullName}>{user?.fullName}</Text>
            <Text style={styles.bioText}>{bio || 'test'}</Text>
          </View>

          {/* Edit Profile Button */}          {user?.id === profile?.clerkId ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.editButton, isFollowing && styles.followingButton]}
              onPress={handleFollowPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.editButtonText}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>        {/* Posts Grid */}
        {profile?.posts ? (
          <FlatList
            data={profile.posts}
            renderItem={renderPost}
            keyExtractor={item => item._id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.postsGrid}
          />
        ) : (
          <View style={styles.noPostsContainer}>
            <Ionicons name="images-outline" size={40} color={COLORS.grey} />
            <Text style={styles.noPostsText}>No posts yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setIsEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor={COLORS.grey}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself"
                placeholderTextColor={COLORS.grey}
                multiline
              />
            </View>            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  username: {
    color: COLORS.primary,
    fontSize: 24,
    fontFamily: 'JetBrainsMono-Medium',
  },
  profileSection: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.grey,
    fontSize: 14,
  },
  bioContainer: {
    marginBottom: 20,
  },
  fullName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bioText: {
    color: COLORS.grey,
    fontSize: 14,
  },
  editButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  postsGrid: {
    padding: 8,
  },
  postContainer: {
    width: tileSize - 12,
    height: tileSize - 12,
    margin: 4,
  },
  leftPost: {
    marginRight: 4,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.white,
    fontSize: 16,
  },  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: COLORS.surfaceLight,
  },
  noPostsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noPostsText: {
    color: COLORS.grey,
    fontSize: 16,
    marginTop: 12,
  },
});