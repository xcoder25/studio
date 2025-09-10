

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Twitter, Facebook, Instagram, CheckCircle, Link, Linkedin, Youtube } from "lucide-react";

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
)

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://picsum.photos/200/200" data-ai-hint="avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="jane.doe@email.com" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>Connect your social media accounts to start posting.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Twitter className="h-6 w-6 text-sky-500" />
                <span className="font-medium">Twitter</span>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Connected</span>
              </div>
            </li>
            <Separator />
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Facebook className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Facebook</span>
              </div>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" /> Connect
              </Button>
            </li>
            <Separator />
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Instagram className="h-6 w-6 text-fuchsia-500" />
                <span className="font-medium">Instagram</span>
              </div>
               <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Connected</span>
              </div>
            </li>
            <Separator />
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TikTokIcon />
                <span className="font-medium">TikTok</span>
              </div>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" /> Connect
              </Button>
            </li>
            <Separator />
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Linkedin className="h-6 w-6 text-blue-700" />
                <span className="font-medium">LinkedIn</span>
              </div>
               <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Connected</span>
              </div>
            </li>
            <Separator />
             <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Youtube className="h-6 w-6 text-red-600" />
                <span className="font-medium">YouTube</span>
              </div>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" /> Connect
              </Button>
            </li>
             <Separator />
             <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PinterestIcon />
                <span className="font-medium">Pinterest</span>
              </div>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" /> Connect
              </Button>
            </li>
             <Separator />
             <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WhatsAppIcon />
                <span className="font-medium">WhatsApp</span>
              </div>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" /> Connect
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
