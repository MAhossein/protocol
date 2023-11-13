"use client"

import {Sheet, SheetContent} from "@/components/ui/sheet";
import SheetCommentContent from "@/components/comments/sheet-comment-content";
import React, {useContext, useEffect, useState} from "react";
import {CommentContext} from "@/context/comment-context";

export default function SheetComment() {
    const {commentEnabled} = useContext(CommentContext);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!sheetOpen) {
            setSheetOpen(commentEnabled ?? false)
        }
    }, [commentEnabled])

    function onOpenSheetChange(open: boolean) {
        setSheetOpen(open)
    }

    return (
        <Sheet open={sheetOpen} onOpenChange={onOpenSheetChange} modal={false}>
            <SheetContent className={"w-[240px] h-full overflow-y-auto"} withClose={false}>
                <SheetCommentContent />
            </SheetContent>
        </Sheet>
    )
}