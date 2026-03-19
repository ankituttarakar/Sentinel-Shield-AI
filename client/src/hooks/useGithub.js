import { useState } from 'react';

export const useGithub = () => {
  const [repos, setRepos] = useState([]);

  const fetchUserRepos = async (username) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await res.json();
    setRepos(data);
  };

  return { repos, fetchUserRepos };
};