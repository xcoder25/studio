
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/context/loading-context';
import { signInWithPopup, OAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12.06,1.75c-2.4,0-4.47,1.44-5.64,3.58a6.3,6.3,0,0,0-1.7,4.32c0,3.59,2.5,5.43,4.64,5.43,1,0,1.9-.38,3.22-.38s2.21.41,3.22.41c2.17,0,4.66-1.81,4.66-5.4C20.46,6.3,17.43,1.75,12.06,1.75ZM15.5,0c-1.34.09-2.8,1-3.6,2.06-1.1,1.4-1.9,3.52-1.54,5.32,1.52-.06,3.15-.9,4-2.14C15.2,3.9,15.8,1.7,15.5,0Z" />
    </svg>
)

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)


export default function LoginPage() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAuthError = (error: any) => {
    console.error(error);
    toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred.",
    });
  }

  const onSubmit = async (data: LoginFormValues) => {
    showLoading();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const token = await user.getIdToken();
        localStorage.setItem('auth-token', token);
        toast({
            title: "Sign In Successful",
            description: `Welcome back, ${user.displayName || user.email}!`,
        });
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    } catch (error: any) {
        handleAuthError(error);
    } finally {
        hideLoading();
    }
  };
  
  const handleAppleSignIn = async () => {
    const provider = new OAuthProvider('apple.com');
    showLoading();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        localStorage.setItem('auth-token', token);
        toast({
            title: "Sign In Successful",
            description: `Welcome back, ${user.displayName || user.email}!`,
        });
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500)
    } catch (error: any) {
        handleAuthError(error);
    } finally {
        hideLoading();
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    showLoading();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        localStorage.setItem('auth-token', token);
        toast({
            title: "Sign In Successful",
            description: `Welcome back, ${user.displayName || user.email}!`,
        });
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    } catch (error: any) {
        handleAuthError(error);
    } finally {
        hideLoading();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your Trendix account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane.doe@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Sign In
            </Button>
          </form>
        </Form>
        
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR SIGN IN WITH</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon />
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleSignIn}>
                <AppleIcon />
            </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
