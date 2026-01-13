import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="GitHubユーザー名を入力 (例: S-Hoshioka)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <button type="submit" disabled={loading || !username.trim()} className="search-button">
          {loading ? '検索中...' : '分析'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
