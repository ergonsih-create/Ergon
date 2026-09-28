/**
 * @license
 * GRAM-DISHA — Firebase Firestore Service Wrapper
 * Real persistent cloud database synchronization with high-availability local fallback.
 */

import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc,
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  UserProfile, 
  BusinessContext, 
  InventoryItem, 
  SalesRecord, 
  SchemeApplication, 
  GrievanceTicket, 
  AppNotification 
} from '../types';

export class FirestoreService {
  /**
   * Helper to get active user ID or email as the owner key
   */
  private static getOwnerId(): string | null {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) return firebaseUser.uid;
    
    // Fallback to local session if Firebase Auth is not completed yet
    try {
      const stored = localStorage.getItem('gram_disha_user_session');
      if (stored) {
        const user = JSON.parse(stored) as UserProfile;
        return user?.id || user?.email || null;
      }
    } catch {
      // Ignored
    }
    return null;
  }

  /**
   * User Profile Persistence
   */
  public static async saveUserProfile(profile: UserProfile): Promise<void> {
    const ownerId = profile.id || this.getOwnerId();
    if (!ownerId) return;
    try {
      const userRef = doc(db, 'users', ownerId);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save user profile:', err);
    }
  }

  public static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Firestore failed to get user profile:', err);
    }
    return null;
  }

  /**
   * Businesses Persistence
   */
  public static async saveBusiness(business: BusinessContext): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'businesses', business.id);
      await setDoc(docRef, {
        ...business,
        userId: ownerId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save business:', err);
    }
  }

  public static async getBusinesses(): Promise<BusinessContext[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'businesses'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: BusinessContext[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as BusinessContext);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get businesses:', err);
      return [];
    }
  }

  /**
   * Inventory Items Persistence
   */
  public static async saveInventoryItem(item: InventoryItem): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'inventory', item.id);
      await setDoc(docRef, {
        ...item,
        userId: ownerId,
        businessId: 'biz_default'
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save inventory item:', err);
    }
  }

  public static async deleteInventoryItem(itemId: string): Promise<void> {
    try {
      const docRef = doc(db, 'inventory', itemId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore failed to delete inventory item:', err);
    }
  }

  public static async getInventory(): Promise<InventoryItem[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'inventory'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: InventoryItem[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as InventoryItem);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get inventory items:', err);
      return [];
    }
  }

  /**
   * Sales Records Persistence
   */
  public static async saveSaleRecord(sale: SalesRecord): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'sales', sale.id);
      await setDoc(docRef, {
        ...sale,
        userId: ownerId,
        businessId: 'biz_default'
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save sales record:', err);
    }
  }

  public static async getSales(): Promise<SalesRecord[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'sales'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: SalesRecord[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as SalesRecord);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get sales:', err);
      return [];
    }
  }

  /**
   * Scheme Applications Persistence
   */
  public static async saveApplication(application: SchemeApplication): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'applications', application.id);
      await setDoc(docRef, {
        ...application,
        userId: ownerId,
        businessId: 'biz_default'
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save application:', err);
    }
  }

  public static async getApplications(): Promise<SchemeApplication[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'applications'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: SchemeApplication[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as SchemeApplication);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get applications:', err);
      return [];
    }
  }

  /**
   * Support Tickets Persistence
   */
  public static async saveSupportTicket(ticket: GrievanceTicket): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'supportTickets', ticket.id);
      await setDoc(docRef, {
        ...ticket,
        userId: ownerId
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save support ticket:', err);
    }
  }

  public static async getSupportTickets(): Promise<GrievanceTicket[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'supportTickets'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: GrievanceTicket[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as GrievanceTicket);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get support tickets:', err);
      return [];
    }
  }

  /**
   * Notifications Persistence
   */
  public static async saveNotification(notification: AppNotification): Promise<void> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return;
    try {
      const docRef = doc(db, 'notifications', notification.id);
      await setDoc(docRef, {
        ...notification,
        userId: ownerId
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore failed to save notification:', err);
    }
  }

  public static async getNotifications(): Promise<AppNotification[]> {
    const ownerId = this.getOwnerId();
    if (!ownerId) return [];
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', ownerId));
      const snapshot = await getDocs(q);
      const list: AppNotification[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as AppNotification);
      });
      return list;
    } catch (err) {
      console.warn('Firestore failed to get notifications:', err);
      return [];
    }
  }
}
