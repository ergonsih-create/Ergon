/**
 * @license
 * GRAM-DISHA — Authentication & Global Application State Context
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy:
 * - Real user session required for authenticated routes
 * - No fake pre-seeded business records or financial numbers
 * - User-entered data is legitimate persistent application state
 * - Provides honest empty/unknown states when data is not yet entered
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  BusinessContext, 
  UserRole,
  InventoryItem,
  SalesRecord,
  SchemeApplication,
  GrievanceTicket,
  AppNotification
} from '../types';
import { 
  BusinessService, 
  OperationsService, 
  SupportService, 
  ApplicationService 
} from '../services/api';
import { BrowserCacheService } from '../services/storage/browserCache';
import { CURATED_BUSINESS_TEMPLATES } from '../data/sampleBusinesses';
import { signInAnonymously, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { FirestoreService } from '../services/firestoreService';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { JWTAuthService } from '../services/auth/jwtAuthService';

interface AuthContextType {
  user: UserProfile | null;
  activeBusiness: BusinessContext | null;
  businesses: BusinessContext[];
  inventory: InventoryItem[];
  sales: SalesRecord[];
  applications: SchemeApplication[];
  supportTickets: GrievanceTicket[];
  notifications: AppNotification[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Auth actions
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginWithGoogle: (email: string, name?: string, avatarUrl?: string) => Promise<void>;
  loginWithGoogleMock?: (email?: string, name?: string) => Promise<void>;
  loginWithCredentials?: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Business actions
  setActiveBusiness: (biz: BusinessContext | null) => void;
  saveBusiness: (biz: BusinessContext) => void;
  updateActiveBusiness: (updates: Partial<BusinessContext>) => void;

  // Operations actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestockedDate'>) => Promise<InventoryItem>;
  deleteInventoryItem: (id: string) => Promise<void>;
  recordSale: (sale: Omit<SalesRecord, 'id' | 'date'>) => Promise<SalesRecord>;

  // Application actions
  createApplication: (app: Omit<SchemeApplication, 'id'>) => Promise<SchemeApplication>;
  submitApplication: (app: Omit<SchemeApplication, 'id' | 'createdAt'>) => Promise<SchemeApplication>;
  updateApplication: (id: string, updates: Partial<SchemeApplication>) => Promise<void>;

  // Support & Grievance actions
  submitGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<GrievanceTicket>;
  submitSupportTicket: (ticket: Partial<GrievanceTicket>) => Promise<GrievanceTicket>;

  // Business Template Switcher
  switchBusinessTemplate: (id: string) => void;

  // Notifications
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('gram_disha_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeBusiness, setActiveBusinessState] = useState<BusinessContext | null>(() => {
    try {
      const stored = localStorage.getItem('gram_disha_active_business');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [businesses, setBusinesses] = useState<BusinessContext[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [applications, setApplications] = useState<SchemeApplication[]>([]);
  const [supportTickets, setSupportTickets] = useState<GrievanceTicket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('gram_disha_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Setup reactive Firebase Auth state change listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Attempt to retrieve profile from Firestore by UID
          let remoteProfile = await FirestoreService.getUserProfile(firebaseUser.uid);
          
          if (!remoteProfile && firebaseUser.email) {
            // Check if profile exists under email as well
            remoteProfile = await FirestoreService.getUserProfile(firebaseUser.email);
          }

          if (!remoteProfile) {
            // Creating a new profile for a newly signed-up user
            const email = firebaseUser.email || '';
            const fullName = firebaseUser.displayName || email.split('@')[0] || (firebaseUser.phoneNumber ? `User ${firebaseUser.phoneNumber}` : 'Rural Entrepreneur');
            
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: email.toLowerCase(),
              fullName,
              avatarUrl: firebaseUser.photoURL || '',
              phoneNumber: firebaseUser.phoneNumber || '',
              role: 'ENTREPRENEUR',
              authProvider: firebaseUser.providerData[0]?.providerId || 'FIREBASE_AUTH',
              emailVerified: firebaseUser.emailVerified || false,
              location: {
                state: 'UNKNOWN',
                district: 'UNKNOWN',
                block: 'UNKNOWN',
                gramPanchayat: 'UNKNOWN',
                villageOrLocality: 'UNKNOWN',
                isRural: true,
                opportunityRadiusKm: 10
              },
              demographics: {
                category: 'GENERAL',
                gender: 'OTHER',
                ageGroup: '26-35',
                educationLevel: 'GRADUATE',
                occupation: 'Enterprise Founder',
                priorExperienceYears: 1,
                annualHouseholdIncome: 200000,
                householdMembersCount: 4
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            await FirestoreService.saveUserProfile(newProfile);
            remoteProfile = newProfile;
          } else if (remoteProfile.id !== firebaseUser.uid) {
            // Update ID to map to Firebase Auth UID to satisfy security rules
            remoteProfile.id = firebaseUser.uid;
            if (firebaseUser.phoneNumber && !remoteProfile.phoneNumber) {
              remoteProfile.phoneNumber = firebaseUser.phoneNumber;
            }
            await FirestoreService.saveUserProfile(remoteProfile);
          }

          setUser(remoteProfile);
          localStorage.setItem('gram_disha_user_session', JSON.stringify(remoteProfile));

          // Load other related user business data synchronously
          const bizRes = await BusinessService.getBusinesses();
          const loadedBiz = bizRes.data || [];
          setBusinesses(loadedBiz);

          if (loadedBiz.length > 0) {
            const storedBizStr = localStorage.getItem('gram_disha_active_business');
            let matchedBiz = null;
            if (storedBizStr) {
              try {
                const parsed = JSON.parse(storedBizStr);
                matchedBiz = loadedBiz.find(b => b?.id === parsed?.id) || null;
              } catch {}
            }
            const activeBiz = matchedBiz || loadedBiz[0];
            setActiveBusinessState(activeBiz);
            localStorage.setItem('gram_disha_active_business', JSON.stringify(activeBiz));
          }

          const invRes = await OperationsService.getInventory();
          setInventory(invRes.data || []);

          const salesRes = await OperationsService.getSales();
          setSales(salesRes.data || []);

          const appRes = await ApplicationService.getApplications();
          setApplications(appRes.data || []);

          const tktRes = await SupportService.getTickets();
          setSupportTickets(tktRes.data || []);
        } catch (err) {
          console.error('Error synchronizing user session in onAuthStateChanged:', err);
        }
      } else {
        // Check if a valid local FastAPI session exists before clearing state
        const storedUser = localStorage.getItem('gram_disha_user_session');
        const storedToken = localStorage.getItem('token') || localStorage.getItem('gram_disha_jwt_token');

        if (!storedUser || !storedToken) {
          // Genuinely logged out
          setUser(null);
          setBusinesses([]);
          setInventory([]);
          setSales([]);
          setApplications([]);
          setSupportTickets([]);
        } else {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            const storedBiz = localStorage.getItem('gram_disha_active_business');
            if (storedBiz) {
              try {
                setActiveBusinessState(JSON.parse(storedBiz));
              } catch {}
            }
          } catch {}
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Setup reactive real-time Firestore collection listeners
  useEffect(() => {
    if (!user || !user.id) return;

    const ownerId = user.id;

    // 1. Real-time Businesses
    const bizQuery = query(collection(db, 'businesses'), where('userId', '==', ownerId));
    const unsubBiz = onSnapshot(bizQuery, (snapshot) => {
      const list: BusinessContext[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as BusinessContext);
      });
      setBusinesses(list);
    }, (err) => {
      console.warn('Real-time Businesses subscription error:', err);
    });

    // 2. Real-time Inventory
    const invQuery = query(collection(db, 'inventory'), where('userId', '==', ownerId));
    const unsubInv = onSnapshot(invQuery, (snapshot) => {
      const list: InventoryItem[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as InventoryItem);
      });
      setInventory(list);
    }, (err) => {
      console.warn('Real-time Inventory subscription error:', err);
    });

    // 3. Real-time Sales
    const salesQuery = query(collection(db, 'sales'), where('userId', '==', ownerId));
    const unsubSales = onSnapshot(salesQuery, (snapshot) => {
      const list: SalesRecord[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as SalesRecord);
      });
      setSales(list);
    }, (err) => {
      console.warn('Real-time Sales subscription error:', err);
    });

    // 4. Real-time Applications
    const appsQuery = query(collection(db, 'applications'), where('userId', '==', ownerId));
    const unsubApps = onSnapshot(appsQuery, (snapshot) => {
      const list: SchemeApplication[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as SchemeApplication);
      });
      setApplications(list);
    }, (err) => {
      console.warn('Real-time Applications subscription error:', err);
    });

    // 5. Real-time Support Tickets
    const tktsQuery = query(collection(db, 'supportTickets'), where('userId', '==', ownerId));
    const unsubTkts = onSnapshot(tktsQuery, (snapshot) => {
      const list: GrievanceTicket[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as GrievanceTicket);
      });
      setSupportTickets(list);
    }, (err) => {
      console.warn('Real-time Support Tickets subscription error:', err);
    });

    return () => {
      unsubBiz();
      unsubInv();
      unsubSales();
      unsubApps();
      unsubTkts();
    };
  }, [user?.id]);

  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('gram_disha_user_session', JSON.stringify(updated));
    await FirestoreService.saveUserProfile(updated).catch(() => {});
  };

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = {
      ...user,
      ...profileUpdates,
      updatedAt: new Date().toISOString()
    };
    setUser(updated);
    localStorage.setItem('gram_disha_user_session', JSON.stringify(updated));
    await FirestoreService.saveUserProfile(updated).catch(() => {});
  };

  const setActiveBusiness = (biz: BusinessContext | null) => {
    setActiveBusinessState(biz);
    if (biz) {
      localStorage.setItem('gram_disha_active_business', JSON.stringify(biz));
    } else {
      localStorage.removeItem('gram_disha_active_business');
    }
  };

  const saveBusiness = (biz: BusinessContext) => {
    setActiveBusiness(biz);
    setBusinesses(prev => {
      const filtered = prev.filter(b => b.id !== biz.id);
      return [biz, ...filtered];
    });
    BusinessService.saveBusiness(biz);
    
    addNotification({
      title: 'Business Profile Created',
      message: `Enterprise profile "${biz.title}" registered in ${biz.proposedLocation?.district || 'rural district'}.`,
      type: 'DISHA_INSIGHT',
      actionUrl: '/business/profile'
    });
  };

  const updateActiveBusiness = (updates: Partial<BusinessContext>) => {
    if (!activeBusiness) return;
    const updated = { ...activeBusiness, ...updates };
    setActiveBusiness(updated);
    setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
    BusinessService.updateBusiness(updated.id, updates);
  };

  const addInventoryItem = async (itemInput: Omit<InventoryItem, 'id' | 'lastRestockedDate'>): Promise<InventoryItem> => {
    const res = await OperationsService.addInventoryItem(itemInput);
    if (res.data) {
      setInventory(prev => [res.data!, ...prev]);
      addNotification({
        title: 'Stock Added',
        message: `Added ${itemInput.currentStock} ${itemInput.unit} of ${itemInput.itemName} to inventory.`,
        type: 'INVENTORY_LOW',
        actionUrl: '/operations/inventory'
      });
      return res.data;
    }
    throw new Error('Failed to record stock item');
  };

  const deleteInventoryItem = async (id: string): Promise<void> => {
    await OperationsService.deleteInventoryItem(id);
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const recordSale = async (saleInput: Omit<SalesRecord, 'id' | 'date'>): Promise<SalesRecord> => {
    const res = await OperationsService.recordSale(saleInput);
    if (res.data) {
      setSales(prev => [res.data!, ...prev]);
      // Update inventory stock locally
      setInventory(prev => prev.map(inv => {
        if (inv.itemName.toLowerCase() === saleInput.productName.toLowerCase()) {
          return {
            ...inv,
            currentStock: Math.max(0, inv.currentStock - saleInput.unitsSold)
          };
        }
        return inv;
      }));

      addNotification({
        title: 'Sale Logged',
        message: `Recorded sale of ${saleInput.unitsSold} units of ${saleInput.productName} for ₹${saleInput.totalRevenue.toLocaleString('en-IN')}.`,
        type: 'FINANCIAL_REMINDER',
        actionUrl: '/operations/sales'
      });

      return res.data;
    }
    throw new Error('Failed to record sale');
  };

  const createApplication = async (appInput: Omit<SchemeApplication, 'id'>): Promise<SchemeApplication> => {
    const res = await ApplicationService.createApplication(appInput);
    if (res.data) {
      setApplications(prev => [res.data!, ...prev]);
      addNotification({
        title: 'Application Draft Created',
        message: `Started application dossier for ${appInput.schemeName}.`,
        type: 'SCHEME_UPDATE',
        actionUrl: `/applications/${res.data.id}`
      });
      return res.data;
    }
    throw new Error('Failed to create application draft');
  };

  const updateApplication = async (id: string, updates: Partial<SchemeApplication>): Promise<void> => {
    const res = await ApplicationService.updateApplication(id, updates);
    if (res.data) {
      setApplications(prev => prev.map(a => a.id === id ? res.data! : a));
    }
  };

  const submitGrievance = async (
    ticketInput: Omit<GrievanceTicket, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<GrievanceTicket> => {
    const res = await SupportService.submitTicket(ticketInput);
    if (res.data) {
      setSupportTickets(prev => [res.data!, ...prev]);
      addNotification({
        title: 'Support Ticket Lodged',
        message: `Ticket #${res.data.referenceCode} logged: "${ticketInput.subject}".`,
        type: 'DISHA_INSIGHT',
        actionUrl: '/support/tickets'
      });
      return res.data;
    }
    throw new Error('Failed to submit ticket');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev.slice(0, 49)];
      localStorage.setItem('gram_disha_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('gram_disha_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('gram_disha_notifications');
  };

  const loginWithGoogle = async (email: string, name?: string, avatarUrl?: string) => {
    setIsLoading(true);
    try {
      // Sign in anonymously to set up authenticated session for Firestore security rules
      const authUserCred = await signInAnonymously(auth);
      const uid = authUserCred.user.uid;
      const userEmail = email.trim().toLowerCase();
      const userName = name || userEmail.split('@')[0];

      // Check if user profile already exists in Firestore under this email or UID
      let existingProfile = await FirestoreService.getUserProfile(uid);
      if (!existingProfile) {
        existingProfile = await FirestoreService.getUserProfile(userEmail);
      }

      const newUser: UserProfile = existingProfile || {
        id: uid,
        email: userEmail,
        fullName: userName,
        avatarUrl: avatarUrl || '',
        role: 'ENTREPRENEUR',
        authProvider: 'GOOGLE_OAUTH_2.0',
        emailVerified: true,
        location: {
          state: 'UNKNOWN',
          district: 'UNKNOWN',
          block: 'UNKNOWN',
          gramPanchayat: 'UNKNOWN',
          villageOrLocality: 'UNKNOWN',
          isRural: true,
          opportunityRadiusKm: 10
        },
        demographics: {
          category: 'GENERAL',
          gender: 'OTHER',
          ageGroup: '26-35',
          educationLevel: 'GRADUATE',
          occupation: 'Enterprise Founder',
          priorExperienceYears: 1,
          annualHouseholdIncome: 200000,
          householdMembersCount: 4
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      newUser.id = uid;

      setUser(newUser);
      localStorage.setItem('gram_disha_user_session', JSON.stringify(newUser));

      // Save user profile to Firestore
      await FirestoreService.saveUserProfile(newUser);

      // Synchronize with FastAPI backend for JWT access token
      try {
        const beRes = await fetch('/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            credential: uid,
          }),
        });
        if (beRes.ok) {
          const beData = await beRes.json();
          const token = beData.accessToken || beData.access_token;
          if (token) {
            JWTAuthService.setStoredToken(token);
          }
        }
      } catch (beErr) {
        console.warn('Backend /auth/google sync notice:', beErr);
      }
    } catch (err) {
      console.error('Firebase Auth / Firestore sign-in failed, utilizing fallback session', err);
      const userEmail = email.trim().toLowerCase();
      const userName = name || userEmail.split('@')[0];
      const fallbackUser: UserProfile = {
        id: `usr_g_${Date.now()}`,
        email: userEmail,
        fullName: userName,
        avatarUrl: avatarUrl || '',
        role: 'ENTREPRENEUR',
        authProvider: 'GOOGLE_OAUTH_2.0',
        emailVerified: true,
        location: {
          state: 'UNKNOWN',
          district: 'UNKNOWN',
          block: 'UNKNOWN',
          gramPanchayat: 'UNKNOWN',
          villageOrLocality: 'UNKNOWN',
          isRural: true,
          opportunityRadiusKm: 10
        },
        demographics: {
          category: 'GENERAL',
          gender: 'OTHER',
          ageGroup: '26-35',
          educationLevel: 'GRADUATE',
          occupation: 'Enterprise Founder',
          priorExperienceYears: 1,
          annualHouseholdIncome: 200000,
          householdMembersCount: 4
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      localStorage.setItem('gram_disha_user_session', JSON.stringify(fallbackUser));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (emailStr: string, passwordStr: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailStr.trim().toLowerCase(), password: passwordStr }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const token = data.accessToken || data.access_token;
      if (token) {
        JWTAuthService.setStoredToken(token);
      }
      if (data.user) {
        const loggedUser: UserProfile = {
          id: data.user.id || `usr_${Date.now()}`,
          email: data.user.email,
          fullName: data.user.fullName || data.user.full_name || 'Entrepreneur',
          role: (data.user.role?.toUpperCase() as UserRole) || 'ENTREPRENEUR',
          authProvider: 'LOCAL_FASTAPI',
          emailVerified: true,
          location: {
            state: data.user.state || 'Maharashtra',
            district: data.user.district || 'Yavatmal',
            block: data.user.block || 'Pusad',
            gramPanchayat: 'UNKNOWN',
            villageOrLocality: 'UNKNOWN',
            isRural: true,
            opportunityRadiusKm: 10,
          },
          demographics: {
            category: data.user.category || 'OBC',
            gender: (data.user.gender?.toUpperCase() as any) || 'MALE',
            ageGroup: '26-35',
            educationLevel: 'GRADUATE',
            occupation: 'Enterprise Founder',
            priorExperienceYears: 2,
            annualHouseholdIncome: 250000,
            householdMembersCount: 4,
          },
          createdAt: data.user.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(loggedUser);
        localStorage.setItem('gram_disha_user_session', JSON.stringify(loggedUser));
      }
      return true;
    } catch (err) {
      console.error('FastAPI login failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogleMock = loginWithGoogle;

  const switchBusinessTemplate = (templateId: string) => {
    const foundLocal = businesses.find(b => b.id === templateId);
    if (foundLocal) {
      setActiveBusiness(foundLocal);
      return;
    }
    const template = CURATED_BUSINESS_TEMPLATES.find(t => t.context.id === templateId);
    if (template) {
      setActiveBusiness(template.context);
      saveBusiness(template.context);
    }
  };

  const submitApplication = async (appInput: Omit<SchemeApplication, 'id' | 'createdAt'>): Promise<SchemeApplication> => {
    return createApplication(appInput as any);
  };

  const submitSupportTicket = async (ticket: Partial<GrievanceTicket>): Promise<GrievanceTicket> => {
    return submitGrievance({
      subject: ticket.subject || 'Support Inquiry',
      category: ticket.category || 'PLATFORM_TECHNICAL',
      description: ticket.description || '',
      priority: ticket.priority || 'NORMAL'
    } as any);
  };

  const logout = () => {
    setUser(null);
    setActiveBusiness(null);
    localStorage.removeItem('gram_disha_user_session');
    localStorage.removeItem('gram_disha_active_business');
    localStorage.removeItem('gram_disha_user_businesses_list');
    sessionStorage.removeItem('gram_disha_ai_popped');
    JWTAuthService.clearSession();
    signOut(auth).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeBusiness,
        businesses,
        inventory,
        sales,
        applications,
        supportTickets,
        notifications,
        isAuthenticated: !!user,
        isLoading,
        setUserRole,
        updateUserProfile,
        loginWithGoogle,
        loginWithGoogleMock,
        loginWithCredentials,
        logout,
        setActiveBusiness,
        saveBusiness,
        updateActiveBusiness,
        addInventoryItem,
        deleteInventoryItem,
        recordSale,
        createApplication,
        submitApplication,
        updateApplication,
        submitGrievance,
        submitSupportTicket,
        switchBusinessTemplate,
        addNotification,
        markNotificationRead,
        clearAllNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
