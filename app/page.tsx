'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface AutoReplyRule {
  id: string
  trigger: string
  response: string
  enabled: boolean
}

interface Message {
  id: string
  sender: string
  text: string
  timestamp: Date
  isAutoReply: boolean
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [showQR, setShowQR] = useState(true)
  const [rules, setRules] = useState<AutoReplyRule[]>([
    { id: '1', trigger: 'hello', response: 'Hi! Thanks for reaching out. How can I help you today?', enabled: true },
    { id: '2', trigger: 'price', response: 'Please check our pricing page or contact sales for detailed information.', enabled: true },
    { id: '3', trigger: 'hours', response: 'We are available Monday-Friday, 9 AM - 6 PM EST.', enabled: true },
  ])
  const [messages, setMessages] = useState<Message[]>([])
  const [newTrigger, setNewTrigger] = useState('')
  const [newResponse, setNewResponse] = useState('')
  const [testMessage, setTestMessage] = useState('')

  const qrCodeValue = 'https://wa.me/qr/DEMO-AUTO-REPLY-SIMULATOR'

  const handleConnect = () => {
    setTimeout(() => {
      setIsConnected(true)
      setShowQR(false)
      setMessages([
        {
          id: '1',
          sender: 'System',
          text: 'WhatsApp connection established. Auto-reply is now active.',
          timestamp: new Date(),
          isAutoReply: false
        }
      ])
    }, 2000)
  }

  const addRule = () => {
    if (newTrigger && newResponse) {
      const newRule: AutoReplyRule = {
        id: Date.now().toString(),
        trigger: newTrigger.toLowerCase(),
        response: newResponse,
        enabled: true
      }
      setRules([...rules, newRule])
      setNewTrigger('')
      setNewResponse('')
    }
  }

  const toggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id))
  }

  const processMessage = (text: string) => {
    const incomingMessage: Message = {
      id: Date.now().toString(),
      sender: 'User',
      text: text,
      timestamp: new Date(),
      isAutoReply: false
    }

    setMessages(prev => [...prev, incomingMessage])

    const lowerText = text.toLowerCase()
    const matchedRule = rules.find(rule =>
      rule.enabled && lowerText.includes(rule.trigger.toLowerCase())
    )

    if (matchedRule) {
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'Auto Reply',
          text: matchedRule.response,
          timestamp: new Date(),
          isAutoReply: true
        }
        setMessages(prev => [...prev, autoReply])
      }, 1000)
    }
  }

  const handleTestMessage = () => {
    if (testMessage && isConnected) {
      processMessage(testMessage)
      setTestMessage('')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🤖 Auto WhatsApp Reply
          </h1>
          <p className="text-gray-600">Automate your WhatsApp responses with custom rules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Connection Status
            </h2>

            {!isConnected && showQR && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Scan this QR code with WhatsApp to connect</p>
                <div className="flex justify-center mb-4 bg-white p-4 rounded-lg inline-block">
                  <QRCodeSVG value={qrCodeValue} size={200} />
                </div>
                <button
                  onClick={handleConnect}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Simulate Connection
                </button>
              </div>
            )}

            {isConnected && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold">✓ Connected to WhatsApp</p>
                  <p className="text-green-600 text-sm">Auto-reply is active</p>
                </div>

                <h3 className="font-semibold mb-2">Test Auto Reply</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTestMessage()}
                    placeholder="Type a test message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleTestMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Send
                  </button>
                </div>

                <div className="mt-4 h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-2">
                  {messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-lg ${msg.isAutoReply ? 'bg-green-100 ml-8' : 'bg-blue-100 mr-8'}`}>
                      <p className="font-semibold text-sm">{msg.sender}</p>
                      <p className="text-gray-800">{msg.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rules Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Auto-Reply Rules</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Add New Rule</h3>
              <input
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="Trigger keyword (e.g., 'hello')"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Auto-reply message"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addRule}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Active Rules ({rules.filter(r => r.enabled).length}/{rules.length})</h3>
              {rules.map(rule => (
                <div key={rule.id} className={`border rounded-lg p-4 ${rule.enabled ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Trigger: <span className="text-blue-600">"{rule.trigger}"</span>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">{rule.response}</p>
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`text-sm font-semibold py-1 px-3 rounded ${
                      rule.enabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    } transition`}
                  >
                    {rule.enabled ? '✓ Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">1. Connect</h3>
              <p className="text-sm text-gray-600">Scan QR code with WhatsApp</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="font-semibold mb-1">2. Set Rules</h3>
              <p className="text-sm text-gray-600">Create custom auto-reply triggers</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold mb-1">3. Auto-Respond</h3>
              <p className="text-sm text-gray-600">Messages are answered automatically</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
