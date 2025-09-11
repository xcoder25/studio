
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
import { getAuth, signInWithPopup, OAuthProvider } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12.06,1.75c-2.4,0-4.47,1.44-5.64,3.58a6.3,6.3,0,0,0-1.7,4.32c0,3.59,2.5,5.43,4.64,5.43,1,0,1.9-.38,3.22-.38s2.21.41,3.22.41c2.17,0,4.66-1.81,4.66-5.4C20.46,6.3,17.43,1.75,12.06,1.75ZM15.5,0c-1.34.09-2.8,1-3.6,2.06-1.1,1.4-1.9,3.52-1.54,5.32,1.52-.06,3.15-.9,4-2.14C15.2,3.9,15.8,1.7,15.5,0Z" />
    </svg>
)

export default function SignupPage() {
  const router = useRouter();
  const { showLoading } = useLoading();
  const { toast } = useToast();
  const auth = getAuth(app);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
    showLoading(2000);
    localStorage.setItem('auth-token', 'user-is-logged-in');
    setTimeout(() => {
        router.push('/dashboard');
    }, 2000);
  };
  
  const handleAppleSignIn = async () => {
    const provider = new OAuthProvider('apple.com');
    showLoading(3000);
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem('auth-token', user.accessToken);
        toast({
            title: "Sign Up Successful",
            description: `Welcome, ${user.displayName || user.email}!`,
        });
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500)
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Apple Sign-Up Failed",
            description: "There was an error signing up with Apple. Please try again.",
        });
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Fill in the details below to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
        
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR SIGN UP WITH</span>
            </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleAppleSignIn}>
            <AppleIcon /> Sign up with Apple
        </Button>
        
        <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
                Sign in
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}

