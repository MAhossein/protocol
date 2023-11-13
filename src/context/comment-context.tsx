"use client"

import React, {useMemo, useState} from 'react';


interface CommentContextProps {
    commentEnabled?: boolean;
    toggleCommentEnabled?: () => void;
}

interface CommentProviderProps {
    children: React.ReactNode;
}

export const CommentContext = React.createContext<CommentContextProps>({
    commentEnabled: false,
    toggleCommentEnabled: () => {},

});

export default function CommentProvider ({ children } : CommentProviderProps) {
    const [commentEnabled, setCommentEnabled] = useState(false);

    const toggleCommentEnabled = () => {
        setCommentEnabled(prev => !prev);
    };


    const value = useMemo(() => ({
        commentEnabled,
        toggleCommentEnabled,
    }), [commentEnabled]);


    function handleClickOutside() {
        if (commentEnabled) {
            setCommentEnabled(false);
        }
    }

    return (
        <CommentContext.Provider value={value}>
            <div id={"clickOutsideComment"} onClick={handleClickOutside}>
                {children}
            </div>
        </CommentContext.Provider>
    );
};