import { Timestamp } from 'firebase/firestore';

export interface Post {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: Timestamp | null;
}