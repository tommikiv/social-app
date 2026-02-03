import { Timestamp } from 'firebase/firestore';

export interface Post {
    id: string;
    text: string;
    mediaUrl?: string;
    userId: string;
    userName: string;
    createdAt: Timestamp | null;
    likes: string[];
    hasLiked?: boolean;
}