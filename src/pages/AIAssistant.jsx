import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Building2,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { AI_ASSISTANT_KNOWLEDGE_BASE, MOCK_PROJECTS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const AIAssistant = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      sender: 'assistant',
      time: 'Just now',
      text: `Hello, I am **DRASHTI AI Copilot**, your infrastructure risk intelligence assistant. 

I can help you identify high-risk assets, analyze SHAP root cause drivers, evaluate state-level bottlenecks, or answer questions about national project performance.

Choose one of the quick prompts below or type your question:`
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    'Which projects are at critical risk?',
    'Which state has the highest project risk?',
    'Why is this project critical?',
    'Which projects have high cost overrun probability?',
    'Show projects with low physical progress.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: 'Just now',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Look up in knowledge base
    const lowerQuery = query.toLowerCase();
    const matched = AI_ASSISTANT_KNOWLEDGE_BASE.find((kb) =>
      kb.triggers.some((trigger) => lowerQuery.includes(trigger.toLowerCase()))
    );

    let responseText = '';
    if (matched) {
      responseText = matched.response;
    } else {
      // General contextual response
      responseText = `### 🔍 Analysis for query: "${query}"

Based on the DRASHTI AI repository of **1,966 active infrastructure projects**:

- **Portfolio Health Status:** 410 Critical Risk Assets (Score ≥80), 640 High Risk Assets (Score 50–79.9).
- **Core Recommendation:** Examine fund burn rates vs physical completion milestones.
- **Top Vulnerable Sectors:** Water Resources (Avg Risk 74.6) and Road Transport (Avg Risk 68.2).

💡 *Tip: Try asking specific questions like "Which projects are at critical risk?" or "Why is this project critical?" for detailed SHAP breakdowns.*`;
    }

    // Simulate smart thinking delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          time: 'Just now',
          text: responseText
        }
      ]);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  // Simple Markdown Parser for responses
  const renderMarkdown = (content) => {
    // Process line by line
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        return (
          <p key={i} className="text-xs sm:text-sm text-slate-700 font-medium pl-2 mb-1">
            {line}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <p key={i} className="text-xs sm:text-sm text-slate-600 pl-4 mb-0.5">
            • {line.replace('- ', '')}
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-1.5" />;
      }
      return (
        <p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'AI Copilot' }]}
      title="DRASHTI AI Assistant"
      subtitle="Ask questions about projects, risks and infrastructure insights."
      action={
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            AI Assistant — Demo Mode
          </span>
          <button
            onClick={handleResetChat}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card flex flex-col h-[650px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-gov-800 text-white'
                    : 'bg-gradient-to-tr from-gov-700 to-sky-500 text-white shadow-sm'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 text-xs sm:text-sm ${
                  m.sender === 'user'
                    ? 'bg-gov-700 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none space-y-1'
                }`}
              >
                {m.sender === 'user' ? (
                  <p>{m.text}</p>
                ) : (
                  <div>{renderMarkdown(m.text)}</div>
                )}
                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    m.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gov-700 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gov-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gov-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-semibold text-gov-800">DRASHTI AI is computing SHAP insights...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Zap className="w-3 h-3 text-amber-500" />
            Suggestions:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-gov-50 hover:text-gov-800 border border-slate-200 rounded-full transition whitespace-nowrap shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask DRASHTI AI about projects, delay probability, or SHAP contributions..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700 transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 bg-gov-700 hover:bg-gov-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default AIAssistant;

