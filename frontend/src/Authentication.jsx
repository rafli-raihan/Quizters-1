import React, { useState } from "react"
export default function Authentication({ onAuthenticate }) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Username is required")
      return
    }
    onAuthenticate(username)
  }
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ICP Quiz</h2>
      <p className="text-gray-600 mb-6">Enter your username to continue</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

