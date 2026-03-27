import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Mail, Facebook, Instagram, LogOut, ChevronRight, Ghost } from 'lucide-react';

const BANNER = `
 ██████╗ ███████╗██╗   ██╗██╗██╗     
 ██╔══██╗██╔════╝██║   ██║██║██║     
 ██║  ██║█████╗  ██║   ██║██║██║     
 ██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║     
 ██████╔╝███████╗ ╚████╔╝ ██║███████╗
 ╚═════╝ ╚══════╝  ╚═══╝  ╚═╝╚══════╝
       [ OSINT TOOL BY DEVIL ]
`;

type LogEntry = {
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string | React.ReactNode;
};

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'output', content: BANNER },
    { type: 'info', content: 'Welcome to Devil OSINT. Type "help" to see commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: LogEntry['type'], content: string | React.ReactNode) => {
    setLogs(prev => [...prev, { type, content }]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const [command, ...args] = trimmed.split(' ');

    addLog('input', `Devil@OSINT:~$ ${cmd}`);

    if (command === 'help') {
      addLog('info', (
        <div className="space-y-1">
          <p>Available commands:</p>
          <p><span className="text-red-500">email [address]</span> - Run Email OSINT</p>
          <p><span className="text-red-500">fb [id]</span> - Facebook ID Lookup</p>
          <p><span className="text-red-500">ig [username]</span> - Instagram Lookup</p>
          <p><span className="text-red-500">clear</span> - Clear terminal</p>
          <p><span className="text-red-500">exit</span> - Close session</p>
        </div>
      ));
      return;
    }

    if (command === 'clear') {
      setLogs([{ type: 'output', content: BANNER }]);
      return;
    }

    if (command === 'exit') {
      addLog('error', 'Devil is leaving...');
      setTimeout(() => window.close(), 1000);
      return;
    }

    if (command === 'email') {
      const email = args[0];
      if (!email) {
        addLog('error', 'Usage: email [address]');
        return;
      }
      setIsProcessing(true);
      addLog('info', `[*] Running Holehe logic on ${email}...`);
      try {
        const res = await fetch('/api/osint/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        addLog('success', `[+] Results for ${email}:`);
        data.results.forEach((r: any) => {
          addLog('output', `  - ${r.site}: ${r.registered ? 'Registered' : 'Not Found'}`);
        });
      } catch (e) {
        addLog('error', '[!] Connection failed');
      }
      setIsProcessing(false);
      return;
    }

    if (command === 'fb') {
      const id = args[0];
      if (!id) {
        addLog('error', 'Usage: fb [id]');
        return;
      }
      setIsProcessing(true);
      addLog('info', `[*] Fetching recovery hints for ${id}...`);
      try {
        const res = await fetch('/api/osint/facebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: id })
        });
        const data = await res.json();
        addLog('success', `[+] Target: ${data.id}`);
        addLog('output', `[+] Hint: ${data.hint}`);
      } catch (e) {
        addLog('error', '[!] Connection failed');
      }
      setIsProcessing(false);
      return;
    }

    if (command === 'ig') {
      const user = args[0];
      if (!user) {
        addLog('error', 'Usage: ig [username]');
        return;
      }
      setIsProcessing(true);
      addLog('info', `[*] Fetching metadata for ${user}...`);
      try {
        const res = await fetch('/api/osint/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user })
        });
        const data = await res.json();
        addLog('success', `[+] Username: ${data.username}`);
        addLog('output', `[+] Bio: ${data.bio}`);
        addLog('output', `[+] Followers: ${data.followers}`);
      } catch (e) {
        addLog('error', '[!] Connection failed');
      }
      setIsProcessing(false);
      return;
    }

    addLog('error', `[!] Command not found: ${command}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-zinc-950 border border-red-900/50 rounded-lg shadow-2xl shadow-red-900/20 overflow-hidden flex flex-col h-[80vh]"
      >
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-2 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <span className="ml-2 text-xs text-zinc-500 uppercase tracking-widest font-bold">Devil OSINT v1.0</span>
          </div>
          <Ghost className="w-4 h-4 text-red-600 animate-pulse" />
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent"
        >
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className={`whitespace-pre-wrap break-all ${
                log.type === 'input' ? 'text-zinc-400' :
                log.type === 'error' ? 'text-red-500' :
                log.type === 'success' ? 'text-green-500' :
                log.type === 'info' ? 'text-blue-400' :
                'text-red-600 font-bold'
              }`}>
                {log.content}
              </div>
            ))}
            {isProcessing && (
              <div className="text-red-500 animate-pulse">
                [*] Processing...
              </div>
            )}
          </div>
        </div>

        {/* Terminal Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/50 border-t border-red-900/30 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-red-600" />
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-transparent border-none outline-none text-red-500 placeholder-red-900/50"
            placeholder="Enter command..."
          />
        </form>
      </motion.div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button onClick={() => handleCommand('email test@example.com')} className="px-4 py-2 bg-red-950/30 border border-red-900/50 rounded hover:bg-red-900/20 transition-colors text-xs flex items-center gap-2">
          <Mail className="w-3 h-3" /> Email OSINT
        </button>
        <button onClick={() => handleCommand('fb devil_user')} className="px-4 py-2 bg-red-950/30 border border-red-900/50 rounded hover:bg-red-900/20 transition-colors text-xs flex items-center gap-2">
          <Facebook className="w-3 h-3" /> FB Lookup
        </button>
        <button onClick={() => handleCommand('ig devil_ig')} className="px-4 py-2 bg-red-950/30 border border-red-900/50 rounded hover:bg-red-900/20 transition-colors text-xs flex items-center gap-2">
          <Instagram className="w-3 h-3" /> IG Lookup
        </button>
        <button onClick={() => handleCommand('help')} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors text-xs flex items-center gap-2">
          <Terminal className="w-3 h-3" /> Help
        </button>
      </div>
    </div>
  );
}
