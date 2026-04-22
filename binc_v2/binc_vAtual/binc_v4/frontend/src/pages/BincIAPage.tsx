import { useEffect, useState, useRef } from 'react'
import { Send, Bot, User, Lightbulb, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import api from '../api/client'

interface Msg { role: 'user' | 'ai'; text: string; time: string }

export default function LobaoIAPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: 'Olá! Sou a **BincIA**, sua assistente inteligente. Posso te ajudar com vendas, estoque, clientes, trocas e muito mais. O que você quer saber?', time: now() }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEnd = useRef<HTMLDivElement>(null)

  function now() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }

  useEffect(() => {
    api.get('/binc-ia/suggestions').then(r => setSuggestions(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Msg = { role: 'user', text, time: now() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/binc-ia/chat', { message: text })
      setMessages(m => [...m, { role: 'ai', text: res.data.response, time: now() }])
      // Refresh suggestions after chat
      api.get('/binc-ia/suggestions').then(r => setSuggestions(r.data)).catch(() => {})
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Desculpe, ocorreu um erro. Tente novamente.', time: now() }])
    } finally { setLoading(false) }
  }

  const renderText = (text: string) => {
    // Bold **text**
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <div className="animate-fade-in">
      <Header title="BincIA" subtitle="Assistente virtual com inteligência do seu negócio" />
      <div className="p-8 flex flex-col gap-5 h-[calc(100vh-81px)]">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-2xl p-6 text-white flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
            <Bot size={36} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">BincIA</h2>
            <p className="text-purple-100 text-sm mt-0.5">Conectada aos dados em tempo real do seu sistema</p>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s.replace(/^[🔍📊📈👥🔄📦💰🛒🏆] /, ''))}
                className="text-left p-3 border border-gray-200 rounded-xl bg-white hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm text-gray-700 flex items-start gap-2">
                <Lightbulb size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Chat container */}
        <div className="card flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-purple-500' : 'bg-primary-500'}`}>
                  {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-gray-100 text-gray-800 rounded-tl-sm' : 'bg-primary-500 text-white rounded-tr-sm'}`}>
                    <p dangerouslySetInnerHTML={{ __html: renderText(msg.text) }} />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 size={14} className="animate-spin" />Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Digite sua pergunta para a BincIA..."
                className="input flex-1 text-sm"
                disabled={loading}
              />
              <button onClick={() => send(input)} disabled={loading || !input.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white rounded-xl transition-all flex items-center gap-2 font-medium text-sm">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
