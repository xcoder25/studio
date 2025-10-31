
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Twitter, Facebook, Instagram, CheckCircle, Link as LinkIcon, Linkedin, Youtube, Upload, Save, LogOut, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { auth, db } from '@/lib/firebase';
import { User, updateProfile, updateEmail, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateDashboardCache } from '@/app/actions/update-dashboard-cache';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  
  const [user, authLoading, authError] = useAuthState(auth);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', email: '', bio: '', website: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { emailNotifications: true, pushNotifications: true, marketingEmails: false, weeklyReports: true },
  });

  const loadUserSettings = useCallback(async (currentUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserSettings(userData);
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
        const defaultSettings = { bio: '', website: '', emailNotifications: true, pushNotifications: true, marketingEmails: false, weeklyReports: true, socialAccounts: [], createdAt: new Date(), updatedAt: new Date() };
        await setDoc(doc(db, 'users', currentUser.uid), defaultSettings);
        setUserSettings(defaultSettings);
        setSocialAccounts([]);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load user settings' });
    } finally {
      setIsLoading(false);
    }
  }, [profileForm, notificationForm, toast]);

  useEffect(() => {
    if (user && !userSettings) {
      loadUserSettings(user);
    }
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, userSettings, authLoading, loadUserSettings, router]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: data.displayName });
      if (data.email !== user.email) {
        await updateEmail(user, data.email);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        bio: data.bio,
        website: data.website,
        updatedAt: new Date(),
      });
      toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updatePassword(user, data.newPassword);
      passwordForm.reset();
      toast({ title: 'Password Updated', description: 'Your password has been successfully updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message || 'Failed to update password' });
    } finally {
      setIsSaving(false);
    }
  };

  const onNotificationSubmit = async (data: NotificationFormValues) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { ...data, updatedAt: new Date() });
      toast({ title: 'Settings Updated', description: 'Your notification preferences have been updated.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Failed to update notification settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialConnect = async (platform: string) => {
    const existingAccount = socialAccounts.find(acc => acc.platform === platform);
    
    if (existingAccount?.connected) {
      await disconnectSocialAccount(platform);
    } else {
      if (platform === 'Facebook') await connectFacebook();
      else if (platform === 'Twitter') await connectTwitter();
      else if (platform === 'Instagram') await connectInstagram();
      else if (platform === 'LinkedIn') await connectLinkedIn();
      else if (platform === 'YouTube') await connectYouTube();
      else if (platform === 'TikTok') await connectTikTok();
      else toast({ title: 'Social Media Integration', description: `${platform} integration will be available soon!` });
    }
  };

  const disconnectSocialAccount = async (platform: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { [`socialAccounts.${platform.toLowerCase()}`]: null, updatedAt: new Date() });
      setSocialAccounts(prev => prev.filter(acc => acc.platform !== platform));
      toast({ title: `${platform} Disconnected`, description: `Successfully disconnected from ${platform}` });
      updateDashboardCache(user.uid, user.displayName || 'User').catch(err => console.error('Failed to update dashboard cache:', err));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Disconnection Failed', description: `Failed to disconnect from ${platform}` });
    }
  };

  const createOAuthPopup = (url: string, type: string) => {
    const popup = window.open(url, `${type}_auth`, 'width=600,height=700,scrollbars=yes,resizable=yes');
    
    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || !event.data.type || !event.data.type.startsWith(type.toUpperCase())) return;

        if (event.data.type === `${type.toUpperCase()}_AUTH_SUCCESS`) {
            const { username, userId, accessToken, profilePicture } = event.data;
            const newAccount = { platform: type, connected: true, username, userId, accessToken, connectedAt: new Date().toISOString(), profilePicture };
            
            updateDoc(doc(db, 'users', user!.uid), { [`socialAccounts.${type.toLowerCase()}`]: newAccount, updatedAt: new Date() })
                .then(() => {
                    setSocialAccounts(prev => [...prev.filter(acc => acc.platform !== type), newAccount]);
                    toast({ title: `${type} Connected!`, description: `Successfully connected ${username}` });
                    updateDashboardCache(user!.uid, user!.displayName || 'User').catch(err => console.error('Failed to update dashboard cache:', err));
                });
        } else {
            toast({ variant: 'destructive', title: `${type} Connection Failed`, description: event.data.error || 'An unknown error occurred.' });
        }
        window.removeEventListener('message', handleMessage);
        popup?.close();
    };

    window.addEventListener('message', handleMessage);

    const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener('message', handleMessage);
        }
    }, 1000);
  };

  const connectFacebook = async () => createOAuthPopup(`/api/auth/facebook/callback`, 'Facebook');
  const connectTwitter = async () => createOAuthPopup(`/api/auth/twitter/callback`, 'Twitter');
  const connectInstagram = async () => createOAuthPopup(`/api/auth/instagram/callback`, 'Instagram');
  const connectTikTok = async () => createOAuthPopup(`/api/auth/tiktok/callback`, 'TikTok');
  const connectLinkedIn = async () => createOAuthPopup(`/api/auth/linkedin/callback`, 'LinkedIn');
  const connectYouTube = async () => createOAuthPopup(`/api/auth/youtube/callback`, 'YouTube');

  const handleDeleteAccount = async () => {
    if (!user) return;
    showLoading();
    try {
      await deleteUser(user);
      toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message || 'Failed to delete account' });
    } finally {
      hideLoading();
      setShowDeleteConfirm(false);
    }
  };

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
  
  if (authLoading || isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return <Alert><AlertCircle className="h-4 w-4" /><AlertDescription>You must be logged in to access settings.</AlertDescription></Alert>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile, Password, Notifications, etc. */}
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
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" disabled><Upload className="mr-2 h-4 w-4" />Change Photo</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input id="displayName" {...profileForm.register('displayName')} disabled={isSaving} />
                {profileForm.formState.errors.displayName && <p className="text-sm text-red-500">{profileForm.formState.errors.displayName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...profileForm.register('email')} disabled={isSaving} />
                {profileForm.formState.errors.email && <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself..." {...profileForm.register('bio')} disabled={isSaving} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://yourwebsite.com" {...profileForm.register('website')} disabled={isSaving} />
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Changes</Button>
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
                        {isConnected && account?.username && <span className="text-sm text-muted-foreground">{account.username}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 text-green-500"><CheckCircle className="h-5 w-5" /><span>Connected</span></div>
                          <Button variant="outline" size="sm" onClick={() => handleSocialConnect(platform.name)} disabled={isSaving}>Disconnect</Button>
                        </div>
                      ) : (
                        <Button variant="outline" onClick={() => handleSocialConnect(platform.name)} disabled={isSaving}><LinkIcon className="mr-2 h-4 w-4" />Connect</Button>
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
            <div><h4 className="font-medium">Sign Out</h4><p className="text-sm text-muted-foreground">Sign out of your account on this device</p></div>
            <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Sign Out</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><h4 className="font-medium text-red-600">Delete Account</h4><p className="text-sm text-muted-foreground">Permanently delete your account and all data</p></div>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
          </div>
          {showDeleteConfirm && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Are you sure? This action cannot be undone.</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Yes, Delete</Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    