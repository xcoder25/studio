'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Twitter, Facebook, Instagram, CheckCircle, Link, Linkedin, Youtube, Upload, Save, LogOut, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { auth, db } from '@/lib/firebase';
import { User, updateProfile, updateEmail, updatePassword, deleteUser, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Facebook SDK types
declare global {
  interface Window {
    FB: any;
  }
}

const TikTokIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.2-2.95-2.2-6.82 0-9.78 1.59-2.1 4.19-3.32 6.78-3.15.02 1.44-.01 2.89.01 4.33.01 1.49-.93 2.81-2.32 3.25-1.18.37-2.44.11-3.48-.61-.82-.58-1.34-1.49-1.32-2.58.02-1.11.56-2.14 1.43-2.71.84-.55 1.83-.75 2.82-.62.24 1.45.02 2.9.01 4.35-.01 1.77-1.2 3.32-2.81 3.78-1.28.36-2.66.07-3.69-.73-.91-.71-1.4-1.8-1.36-2.98.04-1.52.8-2.93 2.01-3.86 1.45-1.1 3.29-1.58 5.06-1.24.01 1.55.02 3.1.01 4.65z" />
    </svg>
);

const PinterestIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-red-700"
    >
        <path d="M12.017 0C5.385 0 0 5.385 0 12.017c0 5.072 3.068 9.423 7.316 11.243-.04-1.034-.14-2.58.077-3.646.208-.94.1.39-1.854.7-2.6.48-1.222-1.222.923-2.915.65-3.415-1.742-10.457.1-10.457 2.164 0 3.823 1.523 3.823 3.755 0 2.2-1.383 3.823-3.122 3.823-.865 0-1.503-.7-1.3-1.56.248-1.056.772-2.19.772-2.954 0-1.343-.772-2.484-2.31-2.484-1.742 0-3.122 1.815-3.122 4.145 0 1.523.538 2.684.538 2.684s-1.742 7.356-2.076 8.647c-.576 2.238.48 4.618 2.6 4.618 3.456 0 4.93-4.223 3.535-6.53.287-.538.538-1.037.538-1.64 0-1.18-.323-2.19-.922-3.122-1.076-1.68-7.85-7.433-2.44-8.85 4.383-1.144 3.415 6.34 5.076 7.646.615.48 1.223.884 1.89 1.18.96.44 2.03.56 3.03.32.1.28.32.96.44 1.2.56 1.24 1.16 2.4 1.96 3.48 1.48 1.96 4.16 2.84 6.56 1.84 2.84-1.2 4.08-4.28 2.88-7.08-1.04-2.4-3.52-1.8-1.52-3.44 2.84-2.28 1.28-7.8-2.12-8.52-3.24-.68-5.24 1.44-5.88 2.48" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-green-500"
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zM12 21.8c5.448 0 9.882-4.435 9.882-9.882S17.448 2.036 12 2.036c-5.447 0-9.882 4.434-9.882 9.882 0 2.06.613 4.025 1.71 5.631L2.525 21.48l6.32-1.659c1.55 .883 3.287 1.348 5.155 1.348z" />
        <path d="M15.343 14.939c-.195-.098-1.155-.57-1.334-.635-.18-.066-.312-.098-.444.098-.132.196-.504.636-.618.768-.114.133-.228.148-.423.05s-1.65-.61-3.144-1.944c-1.162-1.03-1.95-2.296-2.285-2.678-.335-.382-.033-.585.065-.682.09-.09.195-.244.293-.364.1-.118.132-.196.198-.329.066-.132.033-.26-.016-.358-.05-.098-.444-1.066-.61-1.46-.164-.39-.33-.335-.462-.34s-.26-.016-.392-.016a.723.723 0 00-.527.245c-.18.196-.693.682-.693 1.664s.71 1.933.81 2.064c.1.132 1.397 2.136 3.38 2.992.47.203.84.324 1.125.415.478.147.904.128 1.22.078.368-.056 1.155-.47 1.32-.914.164-.444.164-.82.114-.914s-.082-.148-.178-.244z" />
    </svg>
);

// Form schemas
const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  weeklyReports: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

interface SocialAccount {
  platform: string;
  connected: boolean;
  username?: string;
  userId?: string;
  accessToken?: string;
  connectedAt?: string;
  profilePicture?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form instances
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      email: '',
      bio: '',
      website: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      weeklyReports: true,
    },
  });

  // Load user data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Load user settings from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserSettings(userData);
            
            // Update forms with user data
            profileForm.reset({
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              bio: userData.bio || '',
              website: userData.website || '',
            });
            
            notificationForm.reset({
              emailNotifications: userData.emailNotifications ?? true,
              pushNotifications: userData.pushNotifications ?? true,
              marketingEmails: userData.marketingEmails ?? false,
              weeklyReports: userData.weeklyReports ?? true,
            });
            
            setSocialAccounts(userData.socialAccounts || []);
          } else {
            // Create default user document
            const defaultSettings = {
              bio: '',
              website: '',
              emailNotifications: true,
              pushNotifications: true,
              marketingEmails: false,
              weeklyReports: true,
              socialAccounts: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            await setDoc(doc(db, 'users', currentUser.uid), defaultSettings);
            setUserSettings(defaultSettings);
            setSocialAccounts([]);
          }
        } catch (error) {
          console.error('Error loading user settings:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load user settings',
          });
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.displayName,
      });

      // Update email if changed
      if (data.email !== user.email) {
        await updateEmail(user, data.email);
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        bio: data.bio,
        website: data.website,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password update
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updatePassword(user, data.newPassword);
      
      passwordForm.reset();
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update password',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle notification settings update
  const onNotificationSubmit = async (data: NotificationFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date(),
      });

      toast({
        title: 'Settings Updated',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error: any) {
      console.error('Error updating notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update notification settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle social account connection/disconnection
  const handleSocialConnect = async (platform: string) => {
    const existingAccount = socialAccounts.find(acc => acc.platform === platform);
    
    if (existingAccount?.connected) {
      await disconnectSocialAccount(platform);
    } else {
      if (platform === 'Facebook') {
        await connectFacebook();
      } else if (platform === 'Twitter') {
        await connectTwitter();
      } else if (platform === 'Instagram') {
        await connectInstagram();
      } else if (platform === 'LinkedIn') {
        await connectLinkedIn();
      } else if (platform === 'YouTube') {
        await connectYouTube();
      } else {
        toast({
          title: 'Social Media Integration',
          description: `${platform} integration will be available soon!`,
        });
      }
    }
  };

  // Disconnect social account
  const disconnectSocialAccount = async (platform: string) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        [`socialAccounts.${platform.toLowerCase()}`]: null,
        updatedAt: new Date(),
      });

      // Update local state
      setSocialAccounts(prev => prev.filter(acc => acc.platform !== platform));

      toast({
        title: `${platform} Disconnected`,
        description: `Successfully disconnected from ${platform}`,
      });
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast({
        variant: 'destructive',
        title: 'Disconnection Failed',
        description: `Failed to disconnect from ${platform}`,
      });
    }
  };

  // Facebook connection
  const connectFacebook = async () => {
    try {
      // Load Facebook SDK
      if (!window.FB) {
        await loadFacebookSDK();
      }

      window.FB.login(async (response: any) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          
          // Get user info
          window.FB.api('/me', { fields: 'name,email,picture' }, async (userInfo: any) => {
            try {
              // Save to Firestore
              const newAccount = {
                platform: 'Facebook',
                connected: true,
                username: userInfo.name,
                userId: userID,
                accessToken: accessToken,
                connectedAt: new Date().toISOString(),
                profilePicture: userInfo.picture?.data?.url,
              };

              await updateDoc(doc(db, 'users', user!.uid), {
                [`socialAccounts.facebook`]: newAccount,
                updatedAt: new Date(),
              });

              // Update local state
              setSocialAccounts(prev => {
                const filtered = prev.filter(acc => acc.platform !== 'Facebook');
                return [...filtered, newAccount];
              });

              toast({
                title: 'Facebook Connected!',
                description: `Successfully connected ${userInfo.name}`,
              });
            } catch (error) {
              console.error('Error saving Facebook connection:', error);
              toast({
                variant: 'destructive',
                title: 'Connection Failed',
                description: 'Failed to save Facebook connection',
              });
            }
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Connection Cancelled',
            description: 'Facebook connection was cancelled',
          });
        }
      }, { scope: 'email,public_profile,pages_manage_posts,pages_read_engagement' });
    } catch (error) {
      console.error('Facebook connection error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to Facebook',
      });
    }
  };

  // Load Facebook SDK
  const loadFacebookSDK = () => {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'your-facebook-app-id',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        resolve(true);
      };

      document.head.appendChild(script);
    });
  };

  // Twitter connection
  const connectTwitter = async () => {
    try {
      // Twitter OAuth 2.0 flow
      const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/twitter/callback')}&scope=tweet.read%20users.read%20follows.read&state=twitter_auth`;
      
      // Open popup and handle response
      const popup = window.open(twitterAuthUrl, 'twitter_auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      // Listen for popup close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if connection was successful by listening to URL changes
          window.addEventListener('message', handleTwitterCallback);
        }
      }, 1000);
      
      toast({
        title: 'Twitter Connection',
        description: 'Please complete the authorization in the popup window',
      });
    } catch (error) {
      console.error('Twitter connection error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to Twitter',
      });
    }
  };

  // Handle Twitter callback
  const handleTwitterCallback = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
      const { username, userId, accessToken, profilePicture } = event.data;
      
      const newAccount = {
        platform: 'Twitter',
        connected: true,
        username: username,
        userId: userId,
        accessToken: accessToken,
        connectedAt: new Date().toISOString(),
        profilePicture: profilePicture,
      };

      await updateDoc(doc(db, 'users', user!.uid), {
        [`socialAccounts.twitter`]: newAccount,
        updatedAt: new Date(),
      });

      setSocialAccounts(prev => {
        const filtered = prev.filter(acc => acc.platform !== 'Twitter');
        return [...filtered, newAccount];
      });

      toast({
        title: 'Twitter Connected!',
        description: `Successfully connected ${username}`,
      });
    }
    
    window.removeEventListener('message', handleTwitterCallback);
  };

  // Instagram connection
  const connectInstagram = async () => {
    try {
      // Instagram Basic Display API
      const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/instagram/callback')}&scope=user_profile,user_media&response_type=code&state=instagram_auth`;
      
      const popup = window.open(instagramAuthUrl, 'instagram_auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.addEventListener('message', handleInstagramCallback);
        }
      }, 1000);
      
      toast({
        title: 'Instagram Connection',
        description: 'Please complete the authorization in the popup window',
      });
    } catch (error) {
      console.error('Instagram connection error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to Instagram',
      });
    }
  };

  // Handle Instagram callback
  const handleInstagramCallback = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
      const { username, userId, accessToken, profilePicture } = event.data;
      
      const newAccount = {
        platform: 'Instagram',
        connected: true,
        username: username,
        userId: userId,
        accessToken: accessToken,
        connectedAt: new Date().toISOString(),
        profilePicture: profilePicture,
      };

      await updateDoc(doc(db, 'users', user!.uid), {
        [`socialAccounts.instagram`]: newAccount,
        updatedAt: new Date(),
      });

      setSocialAccounts(prev => {
        const filtered = prev.filter(acc => acc.platform !== 'Instagram');
        return [...filtered, newAccount];
      });

      toast({
        title: 'Instagram Connected!',
        description: `Successfully connected ${username}`,
      });
    }
    
    window.removeEventListener('message', handleInstagramCallback);
  };

  // LinkedIn connection
  const connectLinkedIn = async () => {
    try {
      // LinkedIn OAuth 2.0 flow
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/linkedin/callback')}&scope=r_liteprofile%20r_emailaddress%20w_member_social&state=linkedin_auth`;
      
      const popup = window.open(linkedinAuthUrl, 'linkedin_auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.addEventListener('message', handleLinkedInCallback);
        }
      }, 1000);
      
      toast({
        title: 'LinkedIn Connection',
        description: 'Please complete the authorization in the popup window',
      });
    } catch (error) {
      console.error('LinkedIn connection error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to LinkedIn',
      });
    }
  };

  // Handle LinkedIn callback
  const handleLinkedInCallback = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
      const { username, userId, accessToken, profilePicture } = event.data;
      
      const newAccount = {
        platform: 'LinkedIn',
        connected: true,
        username: username,
        userId: userId,
        accessToken: accessToken,
        connectedAt: new Date().toISOString(),
        profilePicture: profilePicture,
      };

      await updateDoc(doc(db, 'users', user!.uid), {
        [`socialAccounts.linkedin`]: newAccount,
        updatedAt: new Date(),
      });

      setSocialAccounts(prev => {
        const filtered = prev.filter(acc => acc.platform !== 'LinkedIn');
        return [...filtered, newAccount];
      });

      toast({
        title: 'LinkedIn Connected!',
        description: `Successfully connected ${username}`,
      });
    }
    
    window.removeEventListener('message', handleLinkedInCallback);
  };

  // YouTube connection
  const connectYouTube = async () => {
    try {
      // YouTube Data API v3 OAuth 2.0
      const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/auth/youtube/callback')}&scope=https://www.googleapis.com/auth/youtube%20https://www.googleapis.com/auth/youtube.upload&response_type=code&state=youtube_auth`;
      
      const popup = window.open(youtubeAuthUrl, 'youtube_auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
      
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.addEventListener('message', handleYouTubeCallback);
        }
      }, 1000);
      
      toast({
        title: 'YouTube Connection',
        description: 'Please complete the authorization in the popup window',
      });
    } catch (error) {
      console.error('YouTube connection error:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to YouTube',
      });
    }
  };

  // Handle YouTube callback
  const handleYouTubeCallback = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'YOUTUBE_AUTH_SUCCESS') {
      const { username, userId, accessToken, profilePicture } = event.data;
      
      const newAccount = {
        platform: 'YouTube',
        connected: true,
        username: username,
        userId: userId,
        accessToken: accessToken,
        connectedAt: new Date().toISOString(),
        profilePicture: profilePicture,
      };

      await updateDoc(doc(db, 'users', user!.uid), {
        [`socialAccounts.youtube`]: newAccount,
        updatedAt: new Date(),
      });

      setSocialAccounts(prev => {
        const filtered = prev.filter(acc => acc.platform !== 'YouTube');
        return [...filtered, newAccount];
      });

      toast({
        title: 'YouTube Connected!',
        description: `Successfully connected ${username}`,
      });
    }
    
    window.removeEventListener('message', handleYouTubeCallback);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    showLoading();
    try {
      // Delete user document from Firestore
      await deleteUser(user);
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete account',
      });
    } finally {
      hideLoading();
      setShowDeleteConfirm(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    showLoading();
    try {
      await signOut(auth);
      localStorage.removeItem('auth-token');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      hideLoading();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" disabled>
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  {...profileForm.register('displayName')}
                  disabled={isSaving}
                />
                {profileForm.formState.errors.displayName && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.displayName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                  disabled={isSaving}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                {...profileForm.register('bio')}
                disabled={isSaving}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                {...profileForm.register('website')}
                disabled={isSaving}
              />
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register('currentPassword')}
                disabled={isSaving}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register('newPassword')}
                disabled={isSaving}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register('confirmPassword')}
                disabled={isSaving}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={notificationForm.watch('emailNotifications')}
                onCheckedChange={(checked) => notificationForm.setValue('emailNotifications', checked)}
                disabled={isSaving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser notifications</p>
              </div>
              <Switch
                checked={notificationForm.watch('pushNotifications')}
                onCheckedChange={(checked) => notificationForm.setValue('pushNotifications', checked)}
                disabled={isSaving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional content</p>
              </div>
              <Switch
                checked={notificationForm.watch('marketingEmails')}
                onCheckedChange={(checked) => notificationForm.setValue('marketingEmails', checked)}
                disabled={isSaving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
              </div>
              <Switch
                checked={notificationForm.watch('weeklyReports')}
                onCheckedChange={(checked) => notificationForm.setValue('weeklyReports', checked)}
                disabled={isSaving}
              />
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Preferences
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social Accounts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Connect your social media accounts to start posting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
              { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
              { name: 'Instagram', icon: Instagram, color: 'text-fuchsia-500' },
              { name: 'TikTok', icon: TikTokIcon, color: 'text-black' },
              { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
              { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
              { name: 'Pinterest', icon: PinterestIcon, color: 'text-red-700' },
              { name: 'WhatsApp', icon: WhatsAppIcon, color: 'text-green-500' },
            ].map((platform) => {
              const account = socialAccounts.find(acc => acc.platform === platform.name);
              const isConnected = account?.connected || false;
              
              return (
                <div key={platform.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <platform.icon className={`h-6 w-6 ${platform.color}`} />
                      <div className="flex flex-col">
                        <span className="font-medium">{platform.name}</span>
                        {isConnected && account?.username && (
                          <span className="text-sm text-muted-foreground">{account.username}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="h-5 w-5" />
                            <span>Connected</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSocialConnect(platform.name)}
                            disabled={isSaving}
                          >
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => handleSocialConnect(platform.name)}
                          disabled={isSaving}
                        >
                          <Link className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>
          
          {showDeleteConfirm && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Are you sure? This action cannot be undone.</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Yes, Delete
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}