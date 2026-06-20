import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const GOALS_COLLECTION = 'goals';

export const firestoreDb = {
  async addGoal(title, category, priority) {
    try {
      const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
        title,
        category,
        priority,
        status: 'active',
        is_active: false,
        userId: auth.currentUser.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  async getAllGoals() {
    try {
      const q = query(
        collection(db, GOALS_COLLECTION),
        where('userId', '==', auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const goals = [];

      querySnapshot.forEach((doc) => {
        const goalData = doc.data();
        goals.push({
          id: doc.id,
          ...goalData,
          created_at: goalData.created_at?.toDate?.() || new Date(),
          updated_at: goalData.updated_at?.toDate?.() || new Date()
        });
      });

      // Sort by is_active and priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return goals.sort((a, b) => {
        if (a.is_active !== b.is_active) return b.is_active - a.is_active;
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  },

  async getActiveGoal() {
    try {
      const q = query(
        collection(db, GOALS_COLLECTION),
        where('userId', '==', auth.currentUser.uid),
        where('is_active', '==', true)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error getting active goal:', error);
      throw error;
    }
  },

  async setActiveGoal(goalId) {
    try {
      const q = query(
        collection(db, GOALS_COLLECTION),
        where('userId', '==', auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      // Clear all active goals
      const updatePromises = [];
      querySnapshot.forEach((docSnapshot) => {
        updatePromises.push(updateDoc(docSnapshot.ref, { is_active: false }));
      });
      await Promise.all(updatePromises);

      // Set the selected goal as active
      const goalRef = doc(db, GOALS_COLLECTION, goalId);
      await updateDoc(goalRef, { is_active: true, updated_at: serverTimestamp() });
    } catch (error) {
      console.error('Error setting active goal:', error);
      throw error;
    }
  },

  async clearActiveGoal() {
    try {
      const q = query(
        collection(db, GOALS_COLLECTION),
        where('userId', '==', auth.currentUser.uid),
        where('is_active', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const updatePromises = [];
      querySnapshot.forEach((docSnapshot) => {
        updatePromises.push(updateDoc(docSnapshot.ref, { is_active: false, updated_at: serverTimestamp() }));
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error clearing active goal:', error);
      throw error;
    }
  },

  async updateGoalStatus(goalId, status) {
    try {
      const goalRef = doc(db, GOALS_COLLECTION, goalId);
      await updateDoc(goalRef, {
        status,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating goal status:', error);
      throw error;
    }
  },

  async deleteGoal(goalId) {
    try {
      await deleteDoc(doc(db, GOALS_COLLECTION, goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
};

export default firestoreDb;
