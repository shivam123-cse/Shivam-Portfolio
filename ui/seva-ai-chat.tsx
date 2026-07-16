// components/ui/seva-ai-chat.tsx
"use client"

import * as React from "react"
import { GradientButton } from "./gradient-button"
import { Mic, Send, Bot, User, CheckCircle, MapPin, Clock, FileText } from "lucide-react"

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  data?: {
    docs?: string[]
    steps?: string[]
    cost?: string
    time?: string
  }
}

export function SevaAIChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "प्रणाम! मैं सेवा AI हूँ। मैं आपकी सरकारी दस्तावेज़, योजनाएं और ग्रामीण सेवाएं ढूंढने में मदद कर सकता हूँ। आप बोलकर या टाइप करके अपनी समस्या बताएं। (जैसे: 'मुझे आय प्रमाण पत्र बनवाना है')"
    }
  ])
  const [input, setInput] = React.useState("")
  const [isListening, setIsListening] = React.useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Simulated AI response for rural/gov services
    setTimeout(() => {
      let aiText = "मुझे समझ आ गया। आपकी सुविधा के लिए आवश्यक जानकारी नीचे दी गई है:"
      let mockData = undefined

      if (input.includes("आय") || input.includes("income") || input.includes("caste") || input.includes("जाति")) {
        mockData = {
          docs: ["आधार कार्ड (Aadhaar Card)", "राशन कार्ड / बिजली बिल", "स्व-घोषणा पत्र (Self Declaration Form)", "भूमि का रसीद (यदि लागू हो)"],
          steps: ["नज़दीकी RTPS काउंटर या सीधे ServicePlus पोर्टल पर जाएं।", "फॉर्म में अपनी सही पारिवारिक आय/विवरण भरें।", "दस्तावेज़ स्कैन करके अपलोड करें।", "सबमिट करने के बाद पावती रसीद प्रिंट करें।"],
          cost: "सरकारी शुल्क: ₹0 (मुफ़्त) | सीएससी केंद्र: ₹30",
          time: "10 से 15 कार्य दिवस (Working Days)"
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        data: mockData
      }])
    }, 1000)
  }

  // Simulated Voice Input
  const toggleVoice = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setInput("मुझे आय प्रमाण पत्र (Income Certificate) बनवाना है")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto border border-zinc-900 bg-slate-950/40 backdrop-blur-md rounded-2xl flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-900 bg-slate-950/80 flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/30">
          <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-none">सेवा AI – डिजिटल सहायक</h2>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Online | हिंदी + English Supported
          </span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                AI
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-medium' 
                : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
              
              {/* AI structured recommendation output */}
              {msg.data && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-4 text-zinc-300">
                  {msg.data.docs && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                        <FileText className="w-4 h-4" /> आवश्यक दस्तावेज़ (Documents Required):
                      </h4>
                      <ul className="list-disc list-inside pl-1 text-zinc-400 space-y-0.5">
                        {msg.data.docs.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  )}
                  {msg.data.steps && (
                    <div>
                      <h4 className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1 text-xs uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" /> आवेदन की प्रक्रिया (Step-by-Step Process):
                      </h4>
                      <ol className="list-decimal list-inside pl-1 text-zinc-400 space-y-0.5">
                        {msg.data.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50 text-xs">
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-zinc-500">अनुमानित समय</p>
                        <p className="text-zinc-300 font-medium">{msg.data.time}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <div>
                        <p className="text-zinc-500">अनुमानित लागत</p>
                        <p className="text-zinc-300 font-medium">{msg.data.cost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Action Bar */}
      <div className="p-4 border-t border-zinc-900 bg-slate-950/80 flex gap-2 items-center">
        <button 
          onClick={toggleVoice}
          className={`p-3 rounded-xl border transition-all ${
            isListening 
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
          title="बोलकर टाइप करें"
        >
          <Mic className="w-5 h-5" />
        </button>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="अपनी समस्या यहाँ लिखें... (e.g., जाति प्रमाण पत्र कैसे बनाएं)"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        />
        <GradientButton onClick={handleSend} className="!px-5 !py-3 min-w-[unset]">
          <Send className="w-4 h-4" />
        </GradientButton>
      </div>
    </div>
  )
}