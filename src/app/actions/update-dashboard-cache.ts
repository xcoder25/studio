'use server';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { findTrends } from '@/ai/flows/find-trends';
import { generateDashboardData } from '@/ai/flows/generate-dashboard-data';

/**
 * Server action to update dashboard cache for a user
 * This can be called from anywhere in the app to refresh dashboard data
 */
export async function updateDashboardCache(userId: string, userName: string) {
  try {
    const userContext = `The user is ${userName}, a social media manager for the tech startup Trendix.`;
    
    // Generate fresh data
    const [trendsResult, dashboardDataResult] = await Promise.all([
      findTrends({ industry: 'AI and Technology' }),
      generateDashboardData({ userContext }),
    ]);

    // Cache in Firestore
    await setDoc(doc(db, 'dashboard-cache', userId), {
      data: dashboardDataResult,
      trends: trendsResult.trends,
      lastUpdated: new Date().toISOString(),
      userId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating dashboard cache:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Triggers a dashboard update notification
 * This signals all connected clients to refresh their data
 */
export async function triggerDashboardUpdate() {
  try {
    await setDoc(doc(db, 'dashboard-updates', 'updates'), {
      lastUpdate: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error triggering dashboard update:', error);
    return { success: false, error: String(error) };
  }
}

