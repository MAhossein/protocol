"use client"

import React, {useState, useEffect, useContext} from "react";
import {CommentContext} from "@/context/comment-context";
import {LucideSpeech, LucideUser, MessageCircle} from "lucide-react";

function AvatarWithMouse() {
    const {commentEnabled} = useContext(CommentContext);
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
            let x = Math.min(event.clientX, window.innerWidth - 50);   // -50 to adjust for the offset you are using
            let y = Math.min(event.clientY - 40 , window.innerHeight - 100);  // -50 to adjust for the offset you are using
            setPosition({x: x, y: y});
        }
        if (commentEnabled) {
            document.addEventListener("mousemove", handleMouseMove);
        }

        // Clean up event listener on component unmount or when commentEnabled value changes
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };

    }, [commentEnabled]); // Dependency on commentEnabled so effect reruns when it changes

    const styles = {
        left: position.x,
        top: position.y ,
        position: 'absolute',
        width: '40px',
        height: '40px',
        // Add styles or classes for your avatar image
    }

    // Replace the 'img' element with your avatar component and style as needed
    return (
        // @ts-ignore
        // commentEnabled && <div className="speech-bubble" style={styles}>
        //     {/*<LucideUser/>*/}
        // </div>);

        commentEnabled && <MessageCircle style={styles} color={"#5e75ee"} strokeWidth={1}/>);
}

export default AvatarWithMouse;