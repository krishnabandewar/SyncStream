"use client";

import { useEffect, useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Client } from "@stomp/stompjs";
import { useParams } from "next/navigation";

export default function RoomEditor() {
    const { roomId } = useParams();
    const [code, setCode] = useState("// Loading connection...");
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        // 1. Fetch initial state via REST
        fetch(`http://localhost:8080/api/room/${roomId}`)
            .then(res => res.text())
            .then(initialCode => {
                if (initialCode) {
                    setCode(initialCode);
                    isInternalUpdate.current = true;
                }
            })
            .catch(err => console.error("Failed to load room state", err));

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            onConnect: () => {
                setConnected(true);
                console.log("Connected to WebSocket");

                // Subscribe to this room's topic
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    if (message.body) {
                        // Prevent echo loop: only update if content is different
                        // In a real OT system, we'd handle deltas here.
                        isInternalUpdate.current = true;
                        setCode(message.body);
                    }
                });
            },
            onDisconnect: () => {
                setConnected(false);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId]);

    function handleEditorChange(value: string | undefined) {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        if (value !== undefined && stompClientRef.current && connected) {
            // Publish the new code to the room
            stompClientRef.current.publish({
                destination: `/app/code/${roomId}`,
                body: value,
            });
            setCode(value);
        }
    }

    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState("");

    async function runCode() {
        setIsRunning(true);
        setOutput("Compiling and Running...");
        try {
            const res = await fetch("http://localhost:8080/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            setOutput(data.output + (data.error ? "\nError:\n" + data.error : ""));
        } catch (e) {
            setOutput("Failed to connect to execution server.");
        }
        setIsRunning(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[85vh] w-full max-w-7xl mx-auto border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-black/40 flex flex-col"
        >
            <div className="bg-[#1e1e1e] p-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-2 px-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm text-white/60 font-mono">Room: {roomId}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-all text-xs font-semibold uppercase tracking-wider border border-green-500/20"
                    >
                        {isRunning ? (
                            <>
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span>Run Code</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center space-x-2 px-2 border-l border-white/10">
                        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-xs text-white/40 uppercase tracking-wider">{connected ? 'Live' : 'Disconnect'}</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col relative">
                <Editor
                    height="70%"
                    defaultLanguage="java"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, monospace',
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        padding: { top: 20 }
                    }}
                />

                {/* Terminal / Output Area */}
                <div className="flex-1 bg-[#121212] border-t border-white/10 p-4 font-mono text-sm overflow-auto">
                    <div className="flex items-center mb-2 text-white/30 text-xs uppercase tracking-widest">
                        <span>Terminal Output</span>
                    </div>
                    {output ? (
                        <pre className="text-neutral-300 whitespace-pre-wrap">{output}</pre>
                    ) : (
                        <span className="text-white/10 italic">Run execution to see output...</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
