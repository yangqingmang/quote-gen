"use client"

import { useState } from 'react'

export default function Home() {
  const [serviceType, setServiceType] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceType || !description) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, description }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate quote')
      }
      
      setQuote(data.quote)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate quote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ AI Quote Generator
          </h1>
          <p className="text-gray-600 mb-2">
            For plumbers, electricians, HVAC, carpenters & handymen
          </p>
          <p className="text-sm text-gray-500">
            Free • No signup • Generates professional quotes in seconds
          </p>
        </header>

        {!quote ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a service...</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="carpentry">Carpentry</option>
                <option value="painting">Painting</option>
                <option value="roofing">Roofing</option>
                <option value="general">General Handyman</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work needed in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Generating...' : 'Generate Quote'}
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Quote</h2>
              <button
                onClick={() => setQuote(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Generate New
              </button>
            </div>
            
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm mb-6">
              {quote}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(quote)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 transition"
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Made for small business owners</p>
          <a 
            href="mailto:feedback@quote-gen.vercel.app?subject=Feedback" 
            className="text-blue-600 hover:underline"
          >
            Send Feedback
          </a>
        </footer>
      </div>
    </div>
  )
}
