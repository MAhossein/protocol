"use client"
import React, {useState} from "react";

import SheetCommentContentList from "@/components/comments/sheet-comment-content-list";
import SearchComment from "@/components/comments/search-comment";
import {Separator} from "@/components/ui/separator";
import {X} from "lucide-react";
import {SheetClose} from "@/components/ui/sheet";


export default function SheetCommentContent() {
    const [searchTerm, setSearchTerm] = useState<string>("")

    return (
        <div className={"grow"}>
            <div className={"flex "} >
                <SearchComment className={""} setSearchTerm={setSearchTerm} />
                <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetClose>
            </div>
            <Separator/>
           <SheetCommentContentList searchTerm={searchTerm}/>
        </div>
    )
}