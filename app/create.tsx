import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState<string>('');

  const handlePost = async () => {
    if (content.trim().length === 0) return;

    try {
      await addDoc(collection(db, "posts"), {
        text: content,
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.email || "Developer",
        createdAt: serverTimestamp(),
      });
      setContent('');
      alert("Post shared!");
      router.back();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Write your post here..."
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'top',
    paddingTop: 10
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});