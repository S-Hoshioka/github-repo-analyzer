import { useState } from 'react'
import SearchBar from './components/SearchBar'
import { githubApi } from './services/githubApi'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [repoData, setRepoData] = useState([])
  const [languageStats, setLanguageStats] = useState([])
  const [error, setError] = useState(null)

  const handleSearch = async (username) => {
    setLoading(true)
    setError(null)
    setUserData(null)
    setRepoData([])
    setLanguageStats([])

    try {
      // ユーザー情報を取得
      const user = await githubApi.getUser(username)
      setUserData(user)

      // リポジトリ情報を取得
      const repos = await githubApi.getUserRepos(username)
      setRepoData(repos)

      // 言語統計を計算
      const languageMap = {}
      for (const repo of repos) {
        if (repo.language) {
          languageMap[repo.language] = (languageMap[repo.language] || 0) + 1
        }
      }

      const languageArray = Object.entries(languageMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      setLanguageStats(languageArray)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub Repo Analyzer</h1>
        <p>GitHubユーザーのリポジトリを分析します</p>
      </header>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {userData && (
        <div className="results">
          <div className="user-info">
            <img src={userData.avatar_url} alt={userData.login} className="avatar" />
            <div className="user-details">
              <h2>{userData.name || userData.login}</h2>
              <p className="username">@{userData.login}</p>
              {userData.bio && <p className="bio">{userData.bio}</p>}
              <div className="stats">
                <div className="stat">
                  <span className="stat-value">{userData.public_repos}</span>
                  <span className="stat-label">リポジトリ</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userData.followers}</span>
                  <span className="stat-label">フォロワー</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{userData.following}</span>
                  <span className="stat-label">フォロー中</span>
                </div>
              </div>
            </div>
          </div>

          {languageStats.length > 0 && (
            <div className="language-stats">
              <h3>使用言語の統計</h3>
              <div className="language-list">
                {languageStats.map((lang) => (
                  <div key={lang.name} className="language-item">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-count">{lang.count} リポジトリ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="repo-list">
            <h3>最近更新されたリポジトリ（最大100件）</h3>
            {repoData.slice(0, 10).map((repo) => (
              <div key={repo.id} className="repo-item">
                <div className="repo-header">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name">
                    {repo.name}
                  </a>
                  {repo.language && <span className="repo-language">{repo.language}</span>}
                </div>
                {repo.description && <p className="repo-description">{repo.description}</p>}
                <div className="repo-stats">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>👁️ {repo.watchers_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
