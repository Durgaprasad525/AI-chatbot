import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I can answer questions about your documents. Upload something to get started.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/chat', {
                message: userMessage,
                history: messages // Pass history if backend supports it
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error answering that.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), #818cf8)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                    <Sparkles size={20} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Deep Chat</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            background: msg.role === 'user' ? 'var(--text-main)' : 'var(--primary)',
                            color: 'white'
                        }}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>

                        <div style={{
                            background: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                            borderTopLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                        }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', gap: '1rem', maxWidth: '80%' }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Bot size={18} />
                        </div>
                        <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '12px', borderTopLeftRadius: '2px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0s' }}></span>
                                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }}></span>
                                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }}></span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about your documents..."
                        style={{
                            flex: 1,
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'var(--background)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0 1.25rem',
                            borderRadius: 'var(--radius)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                            opacity: isLoading || !input.trim() ? 0.7 : 1
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); } 
            40% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default ChatInterface;
