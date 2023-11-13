"use server"
import {
    LogIn,
    LogOut, MoreVertical,
    User,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Suspense,} from "react";
import AuthStatus from "@/components/layout/left/auth-status";
import SignOut from "@/components/layout/left/sign-out";
import SignIn from "@/components/layout/left/sign-in";
import {getServerSession} from "next-auth";

export default async function UserButton() {

    const session = await getServerSession();

    return (
        <div className={"flex items-start justify-end"}>
            <Suspense fallback="Loading...">
                <AuthStatus/>
            </Suspense>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <MoreVertical/>
                    </Button>
                </DropdownMenuTrigger>
                {(session && (
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col items-start">
                                    <span>{session.user?.name}</span>
                                    <span className="text-text-light text-sm">{session.user?.email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem disabled>
                                    <span>View profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem disabled>
                                <span>Projects</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <span>Tickets</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <SignOut/>
                            </DropdownMenuItem>
                        </DropdownMenuContent>)) ||
                    (!session && (
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <SignIn/>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    ))
                }
            </DropdownMenu>
        </div>
    )
}
