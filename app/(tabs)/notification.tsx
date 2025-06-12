import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../constants/theme';

// Données de test pour la démo
const notifications = [
  {
    id: '1',
    type: 'like',
    username: 'programmer.dude',
    userImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    postImage: require('../../assets/images/waterfall.jpg'),
    timeAgo: 'about 8 hours ago',
  },
  {
    id: '2',
    type: 'follow',
    username: 'ryandoe',
    userImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    timeAgo: '1 day ago',
  },
  {
    id: '3',
    type: 'like',
    username: 'bob.doe',
    userImage: 'https://randomuser.me/api/portraits/men/6.jpg',
    postImage: require('../../assets/images/waterfall.jpg'),
    timeAgo: '2 days ago',
  },
];

export default function Notification() {
  const renderNotification = (notification: any) => {
    const isLike = notification.type === 'like';
    const isFollow = notification.type === 'follow';

    return (
      <TouchableOpacity key={notification.id} style={styles.notificationItem}>
        <View style={styles.notificationContent}>
          <Image 
            source={{ uri: notification.userImage }} 
            style={styles.userImage} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{notification.username}</Text>
            <Text style={styles.actionText}>
              {isLike ? 'liked your post' : 'started following you'}
            </Text>
            <Text style={styles.timeAgo}>{notification.timeAgo}</Text>
          </View>
        </View>
        {isLike && (
          <Image 
            source={notification.postImage} 
            style={styles.postImage} 
          />
        )}
        {isFollow && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow Back</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map(notification => renderNotification(notification))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontFamily: 'JetBrainsMono-Medium',
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionText: {
    color: COLORS.grey,
    fontSize: 14,
    marginBottom: 2,
  },
  timeAgo: {
    color: COLORS.grey,
    fontSize: 12,
  },
  postImage: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginLeft: 12,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  followButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
});