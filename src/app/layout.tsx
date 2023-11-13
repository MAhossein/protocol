import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {NavSidebar} from "@/components/layout/left/nav-sidebar";
import UserButton from "@/components/layout/left/user-button";
import CommentProvider from "@/context/comment-context";
import AvatarWithMouse from "@/components/comments/avatar-with-mouse";
import React from "react";
import SheetComment from "@/components/comments/sheet-comment";
import Providers from "@/utils/provider";

export const metadata: Metadata = {
  title: "Protocol Smart Designer",
  description: "Risklick Protocol Smart Designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


    return (
        <html lang="en">
            <body className={""}>
                <Providers>
                    <AvatarWithMouse />
                    <SheetComment/>
                    <div className="flex min-h-screen w-full">
                        <div className={"flex-1 text-text-default mx-8 my-8 grid grid-cols-6"}>
                            <div className="flex flex-col justify-between col-span-1">
                                <NavSidebar/>
                                <UserButton/>
                            </div>
                            <div className="col-span-5 lg:border-l">
                                <div>{children}</div>
                            </div>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
