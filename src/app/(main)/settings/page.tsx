import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Twitter, Facebook, Instagram, CheckCircle, Link } from "lucide-react";

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
