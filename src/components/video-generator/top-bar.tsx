
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus } from "lucide-react"

export default function TopBar() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b bg-card px-6">
        <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Credits:</span>
            <span className="font-semibold">40/40</span>
        </div>
        <Button variant="outline" size="sm">Upgrade</Button>
        <Button size="sm"><Plus className="mr-2 size-4" /> Create</Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="avatar" alt="User Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                    <div className="flex flex-col">
                        <span className="font-semibold">Jane Doe</span>
                        <span className="text-xs text-muted-foreground">Workspace: Jane's Studio</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}
