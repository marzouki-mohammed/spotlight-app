import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from '../../constants/theme';

const stories = [
  { id: '1', username: 'neil', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', username: 'sarah', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', username: 'jack', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', username: 'jill', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', username: 'mike', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const posts = [
  {
    id: '1',
    username: 'programmer.dude',
    userImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    image: require('../../assets/images/waterfall.jpg'),
    likes: 1,
    caption: 'Dude this is sick!',
    timeAgo: 'about 8 hours ago',
    comments: [
      { id: '1', username: 'Programmer Doe', text: 'Dude this is sick!', timeAgo: 'about 8 hours ago' },
      { id: '2', username: 'Burak Orkmez', text: 'SO COOL!', timeAgo: 'less than a minute ago' },
    ]
  },
  // Add more posts as needed
];

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.storiesContainer}
        >
          {stories.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyContainer}>
              <View style={styles.storyImageContainer}>
                <Image source={{ uri: story.image }} style={styles.storyImage} />
              </View>
              <Text style={styles.storyUsername}>{story.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.post}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  <Image source={{ uri: post.userImage }} style={styles.postUserImage} />
                  <Text style={styles.postUsername}>{post.username}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.grey} />
                </TouchableOpacity>
              </View>

              {/* Post Image */}
              <Image source={post.image} style={styles.postImage} />

              {/* Post Actions */}
              <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <Ionicons name="bookmark-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Post Info */}
              <View style={styles.postInfo}>
                <Text style={styles.likes}>{post.likes} likes</Text>
                <View style={styles.captionContainer}>
                  <Text style={styles.caption}>
                    <Text style={styles.username}>{post.username}</Text> {post.caption}
                  </Text>
                </View>
                <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontFamily: 'JetBrainsMono-Medium',
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  storyImageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 2,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  storyUsername: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
  postsContainer: {
    flex: 1,
  },
  post: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  postUsername: {
    color: COLORS.white,
    fontWeight: '600',
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  postInfo: {
    paddingHorizontal: 12,
  },
  likes: {
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  username: {
    color: COLORS.white,
    fontWeight: '600',
    marginRight: 6,
  },
  caption: {
    color: COLORS.white,
  },
  timeAgo: {
    color: COLORS.grey,
    fontSize: 12,
  },
});


