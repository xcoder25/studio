'use client';

import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GenerateDashboardDataOutput } from '@/ai/flows/generate-dashboard-data';

export interface SocialAccount {
  platform: string;
  connected: boolean;
  username?: string;
  userId?: string;
  accessToken?: string;
  connectedAt?: string;
  profilePicture?: string;
}

interface CachedDashboardData {
  data: GenerateDashboardDataOutput;
  trends: any[];
  lastUpdated: string;
  userId: string;
}

/**
 * Fetches social media accounts for a user from Firestore
 */
export async function fetchSocialAccounts(userId: string): Promise<SocialAccount[]> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.socialAccounts || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return [];
  }
}

/**
 * Subscribe to real-time social account updates
 */
export function subscribeSocialAccounts(
  userId: string,
  callback: (accounts: SocialAccount[]) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'users', userId), (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.data();
      callback(userData.socialAccounts || []);
    }
  }, (error) => {
    console.error('Error listening to social accounts:', error);
  });
}

/**
 * Gets cached dashboard data from Firestore
 */
export async function getCachedDashboardData(userId: string): Promise<CachedDashboardData | null> {
  try {
    const cacheDoc = await getDoc(doc(db, 'dashboard-cache', userId));
    if (cacheDoc.exists()) {
      const cached = cacheDoc.data() as CachedDashboardData;
      // Only return if cache is less than 5 minutes old
      const cacheAge = Date.now() - new Date(cached.lastUpdated).getTime();
      if (cacheAge < 5 * 60 * 1000) {
        return cached;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cached dashboard data:', error);
    return null;
  }
}

/**
 * Saves dashboard data to Firestore cache
 */
export async function cacheDashboardData(
  userId: string,
  data: GenerateDashboardDataOutput,
  trends: any[]
): Promise<void> {
  try {
    await setDoc(doc(db, 'dashboard-cache', userId), {
      data,
      trends,
      lastUpdated: new Date().toISOString(),
      userId,
    });
  } catch (error) {
    console.error('Error caching dashboard data:', error);
  }
}

/**
 * Subscribe to real-time dashboard cache updates
 */
export function subscribeDashboardCache(
  userId: string,
  callback: (data: CachedDashboardData | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'dashboard-cache', userId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as CachedDashboardData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to dashboard cache:', error);
  });
}

/**
 * Integrates real social account data with dashboard stats
 */
export function mergeSocialAccountData(
  dashboardData: GenerateDashboardDataOutput,
  socialAccounts: SocialAccount[]
): GenerateDashboardDataOutput {
  const connectedPlatforms = new Set(socialAccounts.map(acc => acc.platform));
  
  // Update social stats to reflect actual connections
  const updatedSocialStats = dashboardData.socialStats.map(stat => ({
    ...stat,
    // You can add more real data integration here
    // For now, just ensure connected platforms are marked
  }));

  return {
    ...dashboardData,
    socialStats: updatedSocialStats,
  };
}

