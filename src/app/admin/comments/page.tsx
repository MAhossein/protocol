"use client";

import React, {useState} from 'react';
import Search from "@/components/layout/top/search";
import MainHeaderTitle from "@/components/layout/top/main-header-title";
import CommentsContent from "@/app/admin/comments/comments-content";

function Comments() {
    const [searchComment, setSearchComment] = useState<string>("");
    return (
        <div className="flex flex-col items-start text-left bg-main-area flex-1">
            <div className="flex justify-between w-full p-5">
                <MainHeaderTitle title={"Comments"} description={"View all comments"}/>
            </div>
            <div className={"p-4"}>
                <Search className={"border border-input"} setSearchTerm={setSearchComment}/>
            </div>
            <CommentsContent searchTerm={searchComment}/>
        </div>
    );
}

export default Comments;
