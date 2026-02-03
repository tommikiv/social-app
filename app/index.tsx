import { Link } from 'expo-router';
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { Heart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
import { Post } from '../src/types/post';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query to fetch posts ordered by creation time
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      setPosts(postsData);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().catch((error) => {
      console.error("Logout Error: ", error);
    });
  };

  const toggleLike = async (postId: string, hasLiked: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error toggling like: " + error);
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const postData = posts.map(post => ({
    ...post,
    hasLiked: post.likes?.includes(auth.currentUser?.uid || '') || false,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={postData}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.createdAt?.toDate().toLocaleString()}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { toggleLike(item.id, item.hasLiked)}}>
                <Heart size={24} color={item.hasLiked ? "red" : "#888"} fill={item.hasLiked ? "red" : "none"} />
              </TouchableOpacity>
              <Text style={styles.likes}>{item.likes?.length || 0}</Text>
            </View>
          </View>
        )}
      />
      <Link href="/create" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  userName: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  postText: { fontSize: 15, color: '#333' },
  timestamp: { fontSize: 12, color: '#888', marginTop: 10 },
  likes: { fontSize: 16, color: '#888', marginTop: 5 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  logoutButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    left: 20,
    height: 40,
    width: 80,
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});