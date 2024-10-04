import { useEffect, useState } from 'react';

import { api, Manga } from './services/api';

let timer = 0;

export function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Manga[]>();

  useEffect(() => {
    // search the MangaDex API debounced
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      api.search(search).then(mangaList => {
        console.log({ mangaList });
        setResults(mangaList);
      });
    }, 500);
  }, [search]);

  return (
    <>
      <h1>Project Mangadex</h1>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ul className="grid gap-2">
        {results?.map(manga => (
          <li key={manga.id} className="bg-zinc-400 flex rounded-md p-2 gap-2">
            <img
              src={manga.coverUrl256}
              alt={`Cover from the title "${manga.title}"`}
              className="w-32 rounded-md"
            />
            <div>
              <h2>{manga.title}</h2>
              <p>{manga.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
