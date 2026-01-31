
import React, { useState, useEffect, useRef } from 'react';
import { askIslamicQuestionStream } from '../services/geminiService';
import { Send, Loader2, MessageCircle, Trash2, ChevronLeft, Sparkles, User, Bot } from './Icons';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

interface GeminiAssistantProps {
    onBack: () => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onBack }) => {
  // Chat States
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]); 
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
      if (!text.trim()) return;
      
      // 1. Kullanıcı mesajını ekle
      const userMsg: ChatMessage = { role: 'user', text: text };
      setMessages(prev => [...prev, userMsg]);
      setChatInput(""); 
      setLoading(true);
      
      try { 
          // 2. Model için boş bir mesaj oluştur
          setMessages(prev => [...prev, { role: 'model', text: '' }]);
          
          const stream = askIslamicQuestionStream(text);
          let fullResponse = "";

          for await (const chunk of stream) {
              fullResponse += chunk;
              // Son mesajı (modelin mesajını) güncelle
              setMessages(prev => {
                  const newMsgs = [...prev];
                  const lastMsg = newMsgs[newMsgs.length - 1];
                  if (lastMsg.role === 'model') {
                      lastMsg.text = fullResponse;
                  }
                  return newMsgs;
              });
          }
      } catch(err) {
          setMessages(prev => [...prev, { role: 'model', text: "Üzgünüm, şu an bağlantı kuramıyorum." }]);
      } finally { 
          setLoading(false); 
      }
  };

  const handleChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loading) return;
    sendMessage(chatInput);
  };

  const handleSuggestionClick = (question: string) => {
      sendMessage(question);
  };

  const clearChat = () => {
      if (confirm("Sohbet geçmişi silinsin mi?")) {
          setMessages([]);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-warm-200 dark:bg-slate-950 transition-colors duration-500 overflow-hidden animate-slide-up">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-warm-200 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-20">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft size={24} />
          </button>
          <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                  <Sparkles size={18} className="text-violet-500" /> Dini Asistan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Yapay Zeka Destekli</p>
          </div>
          {messages.length > 0 ? (
              <button onClick={clearChat} className="p-2 -mr-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Sohbeti Temizle">
                  <Trash2 size={20} />
              </button>
          ) : (
              <div className="w-10"></div>
          )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white/50 dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden mt-2 mx-0 sm:mx-4 sm:rounded-3xl sm:border">
           {/* Chat History Container */}
           <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-6" ref={chatContainerRef}>
              {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
                    <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-6 text-violet-600 dark:text-violet-400 shadow-lg animate-pulse-slow">
                        <MessageCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Hoş Geldiniz</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-8">
                        Aklınıza takılan dini soruları sorabilir, ayet ve hadisler hakkında bilgi alabilirsiniz.
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                        {[
                            "Namazın şartları nelerdir?",
                            "Sabır ile ilgili ayetler",
                            "Orucu bozan durumlar",
                            "Tevekkül nedir?",
                            "Kaza namazı nasıl kılınır?",
                            "Ayetel Kürsi okunuşu"
                        ].map((s, i) => (
                            <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-3 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm text-left flex items-center h-full">
                                {s}
                            </button>
                        ))}
                    </div>
                 </div>
              )}
              
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'model' && (
                          <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 mt-1">
                              <Bot size={18} />
                          </div>
                      )}
                      
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-slate-800 dark:bg-emerald-700 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                      }`}>
                          {msg.role === 'model' && msg.text === '' ? (
                              <div className="flex gap-1 h-5 items-center px-1">
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                              </div>
                          ) : (
                              // Markdown-like rendering (basic)
                              msg.text.split('\n').map((line, i) => (
                                  <p key={i} className={`min-h-[1em] ${line.startsWith('**') ? 'font-bold mt-2' : ''} ${line.startsWith('-') ? 'pl-2' : ''}`}>
                                      {line.replace(/\*\*/g, '')}
                                  </p>
                              ))
                          )}
                      </div>

                      {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-1">
                              <User size={18} />
                          </div>
                      )}
                  </div>
              ))}
           </div>

           {/* Input Area */}
           <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 safe-area-pb">
               <form onSubmit={handleChat} className="relative flex items-end gap-2">
                  <div className="relative flex-1">
                      <textarea 
                        value={chatInput} 
                        onChange={(e) => setChatInput(e.target.value)} 
                        placeholder="Sorunuzu buraya yazın..." 
                        rows={1} 
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(e); }}} 
                        className="w-full pl-4 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none text-sm shadow-inner min-h-[50px] max-h-[120px]" 
                      />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !chatInput.trim()} 
                    className={`h-[50px] w-[50px] rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0 ${
                        loading || !chatInput.trim() 
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 dark:shadow-violet-900/40'
                    }`}
                  >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
                  </button>
               </form>
           </div>
      </div>
    </div>
  );
};
