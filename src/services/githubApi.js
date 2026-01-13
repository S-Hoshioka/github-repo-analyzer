const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API サービス
 */
export const githubApi = {
  /**
   * ユーザー情報を取得
   */
  async getUser(username) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    if (!response.ok) {
      throw new Error('ユーザーが見つかりませんでした');
    }
    return response.json();
  },

  /**
   * ユーザーのリポジトリ一覧を取得
   */
  async getUserRepos(username) {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
    );
    if (!response.ok) {
      throw new Error('リポジトリの取得に失敗しました');
    }
    return response.json();
  },

  /**
   * リポジトリの言語情報を取得
   */
  async getRepoLanguages(owner, repo) {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`
    );
    if (!response.ok) {
      throw new Error('言語情報の取得に失敗しました');
    }
    return response.json();
  },

  /**
   * リポジトリのコミット数を取得
   */
  async getRepoCommitCount(owner, repo) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1`
      );
      if (!response.ok) return 0;

      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (match) return parseInt(match[1]);
      }

      const commits = await response.json();
      return commits.length;
    } catch (error) {
      return 0;
    }
  }
};
