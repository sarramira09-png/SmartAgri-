import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Parcel, Language } from '../types/agri';
import { Send, Bot, User, Sparkles, MessageSquare, CornerDownLeft } from 'lucide-react';

interface AgriChatAdvisorProps {
  currentParcel: Parcel;
  language: Language;
}

export const AgriChatAdvisor: React.FC<AgriChatAdvisorProps> = ({
  currentParcel,
  language,
}) => {
  const isFr = language === 'fr';

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: isFr
      ? `Bonjour ! Je suis votre Ingénieur Agronome Virtuel SmartAgri AI. Je supervise actuellement ${currentParcel.name} (${currentParcel.growthStageBBCH} - ${currentParcel.stageName}). Les sondes indiquent une humidité racinaire de ${currentParcel.soil.depth30cm}% et un ET0 de ${currentParcel.weather.et0} mm/j. Comment puis-je vous aider sur vos choix de fertigation, protection phytosanitaire ou pilotage d'irrigation ?`
      : `Hello! I am your SmartAgri AI Virtual Agronomist. I am currently monitoring ${currentParcel.name} (${currentParcel.growthStageBBCH} - ${currentParcel.stageName}). Soil root-zone moisture is at ${currentParcel.soil.depth30cm}% with daily ET0 at ${currentParcel.weather.et0} mm/day. How can I assist you with fertigation, pest management or irrigation scheduling today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const quickPrompts = isFr
    ? [
        "Comment optimiser la fertigation azotée à ce stade ?",
        "Y a-t-il un risque de lessivage avec les prochaines pluies ?",
        "Quelles alternatives bio au cuivre pour le mildiou ?",
        "Pourquoi privilégier le goutte-à-goutte de nuit ?",
      ]
    : [
        "How to optimize nitrogen fertigation at this stage?",
        "Is there a leaching risk with upcoming rains?",
        "Organic biocontrol alternatives to copper for blight?",
        "Why prioritize night-time drip irrigation?",
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/agri-advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            parcel: currentParcel.name,
            crop: currentParcel.cropName,
            variety: currentParcel.variety,
            stage: `${currentParcel.growthStageBBCH} - ${currentParcel.stageName}`,
            soil30cm: currentParcel.soil.depth30cm,
            rfuCap: currentParcel.soil.fieldCapacity,
            et0: currentParcel.weather.et0,
            temp: currentParcel.weather.ambientTemp,
            humidity: currentParcel.weather.airHumidity,
          },
          language: language,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || (isFr ? "Analyse effectuée avec succès." : "Analysis completed."),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isFr
          ? "Selon les règles agronomiques standards, maintenez l'humidité entre la capacité au champ et la réserve facilement utilisable, et évitez tout mouillage foliaire en période de forte hygrométrie."
          : "Maintain soil moisture within readily available water thresholds, and avoid overhead foliage wetting during high humidity periods.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base flex items-center gap-2">
              <span>{isFr ? 'Conseiller Agronomique IA en Direct' : 'Live AI Agronomic Consultant'}</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-bold">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {isFr ? 'Questions techniques sur la fertigation, biocontrôle, stress abiotique et calendrier cultural' : 'Technical guidance on fertigation, biocontrol, abiotic stress & field planning'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-400 hidden sm:block">
          Contexte: <span className="text-emerald-400">{currentParcel.cropName}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-stone-800 border border-stone-700 text-emerald-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-stone-950/90 border border-stone-800 text-stone-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.content}
                <div
                  className={`text-[10px] font-mono mt-1 text-right ${
                    isUser ? 'text-emerald-200' : 'text-stone-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 text-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-3 rounded-tl-none flex items-center gap-1.5 text-xs text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isFr ? 'L\'agronome analyse vos données...' : 'Agronomist is formulating answer...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isFr
              ? "Posez une question technique à l'agronome..."
              : "Ask the agronomist a technical question..."
          }
          className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isFr ? 'Envoyer' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
