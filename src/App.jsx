import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return
      setLoading(true)
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`)
        const json = await response.json()
        setData(json.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 500)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="app-container">
      <header>
        <h1>GitHub Repository Search</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
          className="search-input"
        />
      </header>

      <main>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error: {error}</div>}
        <div className="repo-grid">
          {data.map(repo => (
            <div key={repo.id} className="repo-card">
              <h2>{repo.name}</h2>
              <p>{repo.description}</p>
              <div className="repo-stats">
                <span>⭐ {repo.stargazers_count}</span>
                <span>🔄 {repo.forks_count}</span>
              </div>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View Repository
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
