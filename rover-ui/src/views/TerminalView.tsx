import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal as TerminalIcon, Plus, X } from 'lucide-react';

interface HistoryLine {
  id: number;
  type: 'input' | 'output' | 'system';
  text: string;
  path?: string;
}

interface TerminalSession {
  id: string;
  name: string;
  history: HistoryLine[];
  currentPath: string;
  isConnected: boolean;
  ws?: WebSocket;
}

const TerminalView: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateSession = (id: string, data: Partial<TerminalSession>) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const addHistory = (id: string, type: 'input' | 'output' | 'system', text: string, path?: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, history: [...s.history, { id: Date.now() + Math.random(), type, text, path }] }
          : s
      )
    );
  };

  // ── Buat tab & WebSocket baru ─────────────────────────────────────────────
  const createNewTab = () => {
    const newId = Math.random().toString(36).substring(7);
    const newSession: TerminalSession = {
      id: newId,
      name: `Ubuntu ${sessions.length + 1}`,
      history: [{ id: Date.now(), type: 'system', text: '🟢 Welcome to New Ubuntu Session' }],
      currentPath: '~',
      isConnected: false,
    };
    setSessions(prev => [...prev, newSession]);
    setActiveTabId(newId);
    connectWebSocket(newId);
  };

  const connectWebSocket = (sessionId: string) => {
    const socket = new WebSocket('ws://localhost:8002/ws/terminal');

    socket.onopen = () => {
      updateSession(sessionId, { isConnected: true, ws: socket });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'path') {
          // Konversi path absolut ke ~/ jika dalam home dir
          const homeMatch = data.path.match(/^\/home\/[^/]+/);
          let displayPath = data.path;
          if (homeMatch) {
            displayPath = '~' + data.path.slice(homeMatch[0].length);
          }
          updateSession(sessionId, { currentPath: displayPath });

        } else if (data.type === 'output') {
          const text = data.text ?? '';
          // Hanya tampilkan jika ada isinya
          if (text !== '') {
            addHistory(sessionId, 'output', text);
          }
        }
      } catch (e) {
        addHistory(sessionId, 'output', '[Error parsing server response]');
      }
    };

    socket.onclose = () => {
      updateSession(sessionId, { isConnected: false });
      addHistory(sessionId, 'system', '🔴 Koneksi terputus. Mencoba reconnect...');
      setTimeout(() => {
        setSessions(prev => {
          const still = prev.find(s => s.id === sessionId);
          if (still && !still.isConnected) connectWebSocket(sessionId);
          return prev;
        });
      }, 2000);
    };

    socket.onerror = () => {
      addHistory(sessionId, 'system', '⚠️ WebSocket error. Pastikan server berjalan di port 8002.');
    };
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === id);
    if (session?.ws) session.ws.close();
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeTabId === id) setActiveTabId(remaining.length > 0 ? remaining[0].id : null);
  };

  // Init tab pertama
  useEffect(() => {
    if (sessions.length === 0) createNewTab();
  }, []);

  // Auto-scroll saat history bertambah
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions]);

  // Focus input saat ganti tab
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeTabId]);

  const activeSession = sessions.find(s => s.id === activeTabId);

  // ── Handler keyboard ──────────────────────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

    // ── Ctrl+C — kirim sinyal interrupt ke server ──────────────────────────
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault(); // jangan copy teks

      if (!activeSession) return;

      // Kalau ada teks di input, cukup clear saja (mirip terminal asli)
      if (inputValue) {
        // Tampilkan "^C" di history lalu clear input
        addHistory(activeSession.id, 'input', `${inputValue}^C`, activeSession.currentPath);
        setInputValue('');
        return;
      }

      // Kalau input kosong, kirim sinyal ke server untuk kill proses
      addHistory(activeSession.id, 'output', '^C');
      if (activeSession.ws?.readyState === WebSocket.OPEN) {
        activeSession.ws.send('\x03'); // karakter Ctrl+C (ASCII ETX)
      }
      return;
    }

    // ── Enter — jalankan perintah ──────────────────────────────────────────
    if (e.key === 'Enter') {
      if (!activeSession || !inputValue.trim()) return;

      const cmd = inputValue.trim();
      addHistory(activeSession.id, 'input', cmd, activeSession.currentPath);

      if (cmd === 'clear') {
        updateSession(activeSession.id, { history: [] });
      } else if (activeSession.ws?.readyState === WebSocket.OPEN) {
        activeSession.ws.send(cmd);
      } else {
        addHistory(activeSession.id, 'system', '⚠️ Tidak terhubung ke server. Tunggu reconnect...');
      }

      setInputValue('');
    }
  };

  // ── Tema ──────────────────────────────────────────────────────────────────
  const containerBg = isDarkMode
    ? 'bg-[#0f172a] border-white/10 shadow-2xl'
    : 'bg-white border-slate-200 shadow-xl';
  const terminalBg = isDarkMode ? 'bg-black/90' : 'bg-[#1e1e1e]';

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col p-4">

      {/* TAB BAR */}
      <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
        {sessions.map(s => (
          <div
            key={s.id}
            onClick={() => setActiveTabId(s.id)}
            className={`flex items-center gap-3 px-4 py-2 rounded-t-xl cursor-pointer transition-all border-t border-x text-xs font-bold uppercase tracking-widest ${
              activeTabId === s.id
                ? isDarkMode
                  ? 'bg-[#0f172a] border-white/20 text-emerald-500'
                  : 'bg-white border-slate-200 text-blue-600'
                : isDarkMode
                ? 'bg-black/40 border-transparent text-slate-500 hover:text-slate-300'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <TerminalIcon size={14} />
            {s.name}
            {/* Dot status koneksi */}
            <span className={`w-1.5 h-1.5 rounded-full ${s.isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <X
              size={14}
              className="hover:text-rose-500 transition-colors"
              onClick={(e: React.MouseEvent) => closeTab(s.id, e)}
            />
          </div>
        ))}
        <button
          onClick={createNewTab}
          className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* TERMINAL BODY */}
      <div className={`flex-1 rounded-b-2xl rounded-tr-2xl border flex flex-col overflow-hidden ${containerBg}`}>
        {activeSession ? (
          <div
            className={`flex-1 p-5 font-mono text-sm overflow-y-auto ${terminalBg}`}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="space-y-1">
              {activeSession.history.map(line => (
                <div key={line.id}>
                  {line.type === 'system' && (
                    <span className="text-emerald-500 font-bold">{line.text}</span>
                  )}
                  {line.type === 'input' && (
                    <div>
                      <span className="text-blue-400 font-bold mr-2">
                        ubuntu@rov:{line.path ?? activeSession.currentPath}$
                      </span>
                      <span className="text-white">{line.text}</span>
                    </div>
                  )}
                  {line.type === 'output' && (
                    <span className={`whitespace-pre-wrap block ${
                      line.text.startsWith('⚠️') || line.text.startsWith('🔴')
                        ? 'text-yellow-400'
                        : line.text.startsWith('✅') || line.text.startsWith('▶')
                        ? 'text-emerald-400'
                        : line.text.startsWith('^C') || line.text.includes('SIGINT')
                        ? 'text-orange-400'
                        : line.text.startsWith('[Proses selesai')
                        ? 'text-slate-500 italic'
                        : 'text-slate-300'
                    }`}>
                      {line.text}
                    </span>
                  )}
                </div>
              ))}
              <div ref={endOfTerminalRef} />
            </div>

            {/* Input prompt */}
            <div className="flex items-center mt-3 border-t border-white/5 pt-2">
              <span className="text-blue-400 font-bold mr-2 shrink-0">
                ubuntu@rov:{activeSession.currentPath}$
              </span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 bg-transparent outline-none text-white font-mono caret-emerald-400"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-mono italic">
            No active sessions. Click + to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalView;