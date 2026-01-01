"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

export default function CodeEditor() {
  const [code, setCode] = useState("// Start typing seamlessly...");
  
  // Placeholder for WebSocket connection
  useEffect(() => {
    // connect to ws://localhost:8080/ws
  }, []);

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
      // Send updates to backend
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[80vh] w-[90%] max-w-6xl mx-auto border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm bg-black/40"
    >
      <div className="bg-[#1e1e1e] p-2 flex items-center justify-between border-b border-white/5">
         <div className="flex space-x-2 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
         </div>
         <span className="text-xs text-white/40 font-mono">Main.java - SyncStream</span>
         <div />
      </div>
      <Editor
        height="100%"
        defaultLanguage="java"
        defaultValue="// Start typing..."
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace', 
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on"
        }}
      />
    </motion.div>
  );
}
