
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, UserPlus, Shield, Edit, BarChart, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const teamMembers = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Admin', avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com', role: 'Editor', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Analyst', avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 4, name: 'Sara Miller', email: 'sara.miller@example.com', role: 'Editor', avatar: 'https://picsum.photos/100/100?random=4' },
];

const roleConfig = {
    Admin: { icon: Shield, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    Editor: { icon: Edit, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    Analyst: { icon: BarChart, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

export default function TeamManagementPage() {
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    return (
    <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Invite and manage your team members and their roles.</CardDescription>
                </div>
                <Button onClick={() => setIsInviteOpen(true)}>
                    <UserPlus className="mr-2"/>
                    Invite Member
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="avatar" />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("gap-1", roleConfig[member.role as keyof typeof roleConfig].color)}>
                                    {React.createElement(roleConfig[member.role as keyof typeof roleConfig].icon, { className: "size-3" })}
                                    {member.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2" /> Edit Role
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2" /> Remove Member
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite New Member</DialogTitle>
                    <DialogDescription>Enter the email and select a role for your new team member.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="name@company.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Analyst">Analyst</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsInviteOpen(false)}>Send Invitation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
}

function cn(...inputs: any[]) {
    // A utility function for conditional class names
    return inputs.filter(Boolean).join(' ');
}
