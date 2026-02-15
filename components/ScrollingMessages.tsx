"use client"; // since we are using state and effects

import { useState, useEffect } from "react";

interface ScrollingMessagesProps {
    messages: string[];
    duration?: number; // duration per message in seconds
}

export default function ScrollingMessages({
    messages,
    duration = 10,
}: ScrollingMessagesProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, duration * 1000); // change every duration seconds
        return () => clearInterval(interval);
    }, [messages, duration]);

    return (
        <div className="relative overflow-hidden bg-green-800 w-full p-4">
            <div
                key={index} // key changes to trigger re-render
                className="absolute whitespace-nowrap top-1/2 -translate-y-1/2 animate-scroll-ltr text-base font-extrabold text-white w-full"
                style={{ animationDuration: `${duration}s` }}
            >
                {messages[index]}
            </div>
        </div>
    );
}
