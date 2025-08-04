'use client'
import { useState } from 'react'
import ResponseViewer from './ResponseViewer'

interface Header {
  key: string
  value: string
}

interface ResponseData {
  status?: number
  headers?: Record<string, string>
  body?: unknown
  error?: string
}

export default function RequestEditor() {
  const [url, setUrl] = useState<string>('')
  const [method, setMethod] = useState<string>('GET')
  const [body, setBody] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }])
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sendRequest = async () => {
    if (isLoading) return
    setIsLoading(true)
    setResponse(null)

    if (!url.trim()) {
      setResponse({ error: 'URL is required' })
      setIsLoading(false)
      return
    }

    let requestUrl = url
    try {
      new URL(url)
    } catch {
      setResponse({ error: 'Invalid URL format' })
      setIsLoading(false)
      return
    }

    try {
      const fetchHeaders: Record<string, string> = {}
      headers.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) {
          fetchHeaders[key.trim()] = value.trim()
        }
      })

      const options: RequestInit = {
        method,
        headers: fetchHeaders,
      }

      let requestBody = body.trim()

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        if (!requestBody) {
          setResponse({ error: `Body is required for ${method} requests` })
          setIsLoading(false)
          return
        }

        let parsedBody: any
        try {
          parsedBody = JSON.parse(requestBody)
        } catch {
          setResponse({ error: 'Invalid JSON body' })
          setIsLoading(false)
          return
        }

        if (method === 'POST') {
          try {
            const res = await fetch(url, { method: 'GET' })
            const data = await res.json()
            const lastId = Array.isArray(data)
              ? Math.max(...data.map((item: any) => item.id || 0), 0)
              : 0
            parsedBody.id = lastId + 1
            requestBody = JSON.stringify(parsedBody)
          } catch {
            parsedBody.id = 1
            requestBody = JSON.stringify(parsedBody)
          }
        } else if (method === 'PUT' || method === 'PATCH') {
          if (!id.trim()) {
            setResponse({ error: 'ID is required for PUT/PATCH requests' })
            setIsLoading(false)
            return
          }

          parsedBody.id = parseInt(id, 10)
          if (isNaN(parsedBody.id)) {
            setResponse({ error: 'ID must be a valid number' })
            setIsLoading(false)
            return
          }

          if (!url.endsWith(`/${parsedBody.id}`)) {
            requestUrl = `${url}/${parsedBody.id}`.replace(/\/+/g, '/')
          }

          requestBody = JSON.stringify(parsedBody)
        }

        options.body = requestBody
        if (!fetchHeaders['Content-Type']) {
          fetchHeaders['Content-Type'] = 'application/json'
        }
      }

      const res = await fetch(requestUrl, options)
      const resText = await res.text()
      let parsedResponseBody: any
      try {
        parsedResponseBody = JSON.parse(resText)
      } catch {
        parsedResponseBody = resText
      }

      if (method === 'POST' && res.ok && parsedResponseBody?.id) {
        const newId = parsedResponseBody.id
        setMethod('PUT') // Switch to PUT after successful POST
        setId(newId.toString())
        setBody(JSON.stringify({ ...parsedResponseBody, id: newId }, null, 2))
      }

      setResponse({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        body: parsedResponseBody,
      })
    } catch (err) {
      setResponse({
        error: err instanceof Error ? err.message : 'Failed to send request',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearForm = () => {
    setUrl('')
    setMethod('GET')
    setBody('')
    setId('')
    setHeaders([{ key: '', value: '' }])
    setResponse(null)
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6 bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md">
      {response?.error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-2 rounded-md text-sm">
          {response.error}
        </div>
      )}
      {response?.status && !response.error && (
        <div
          className={`border px-4 py-2 rounded-md text-sm ${
            response.status === 200
              ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-200'
              : response.status >= 400 && response.status < 500
              ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200'
              : response.status >= 500
              ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-200'
              : 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200'
          }`}
        >
          {response.status === 200
            ? `Request successful (Status: ${response.status})`
            : response.status >= 400 && response.status < 500
            ? `Client error (Status: ${response.status})`
            : response.status >= 500
            ? `Server error (Status: ${response.status})`
            : `Response received (Status: ${response.status})`}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 sm:p-3 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 appearance-none pr-8"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
          }}
          aria-label="Select HTTP method"
          disabled={isLoading}
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://api.example.com)"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 sm:p-3 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label="Enter API URL"
          disabled={isLoading}
        />
   
        <button
          onClick={sendRequest}
          className={`bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Headers</h2>
        {headers.map((h, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Key (e.g., Content-Type)"
              value={h.key}
              onChange={(e) => {
                const newHeaders = [...headers]
                newHeaders[i].key = e.target.value
                setHeaders(newHeaders)
              }}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Value (e.g., application/json)"
              value={h.value}
              onChange={(e) => {
                const newHeaders = [...headers]
                newHeaders[i].value = e.target.value
                setHeaders(newHeaders)
              }}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={isLoading}
            />
          </div>
        ))}
        <button
          onClick={() => setHeaders([...headers, { key: '', value: '' }])}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          disabled={isLoading}
        >
          + Add Header
        </button>
      </div>

      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <div className="w-full">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Request Body</h2>
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`{"example": "data"}${
              method === 'PUT' || method === 'PATCH' ? ' and provide ID above' : ''
            }`}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono resize-y"
            disabled={isLoading}
          />
          {method === 'PATCH' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PATCH is used to partially update a resource. Include only the fields to modify.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={clearForm}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
          disabled={isLoading}
        >
          Clear Form
        </button>
      </div>

      {response && <ResponseViewer response={response} />}
    </div>
  )
}