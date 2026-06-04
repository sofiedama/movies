'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

const [isFilterOpen, setIsFilterOpen] = useState(false);  //přidám filtr ( určuje jestli je filtr zaplý nebo ne - výchoze je vyplý)
const [selectedGenres, setSelectedGenres] = useState([]); // k uložení jaké žánry v filtru filtruju, je tam array takže jich může být více najednou
const [isGenreOpen, setIsGenreOpen] = useState(true); // přidání možnosti to sbalit do sebe 


  useEffect(() => {
    async function fetchMovies() {
      const { data } = await supabase.from('movies').select('*');
      setMovies(data || []);
      setLoading(false);
    }
    fetchMovies();
  }, []);

  async function toggleFavorite(e, movieId, currentStatus) {
    e.preventDefault(); 
    e.stopPropagation(); 

    setMovies(prevMovies => 
      prevMovies.map(m => m.id === movieId ? { ...m, is_favorite: !currentStatus } : m)
    );

    // Pošleme info do databáze 
    const { error } = await supabase
      .from('movies')
      .update({ is_favorite: !currentStatus })
      .eq('id', movieId);

    if (error) {
      // Pokud se to nepovedlo nahlásíme chybu
      alert("Nepodařilo se uložit oblíbené.");
      setMovies(prevMovies => 
        prevMovies.map(m => m.id === movieId ? { ...m, is_favorite: currentStatus } : m)
      );
    }
  }

  const handleGenreChange = (genre) => {
  if (selectedGenres.includes(genre)) {
    // Pokud už. klikl na žánr podruhý (zrušil označení)
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  } else {
    // Pokud tam nenípř přidáme ho (až na konec array)
    setSelectedGenres([...selectedGenres, genre]);
  }
};
// ZDE SE DEFINUJE FILTR
  const allGenres = [...new Set(movies.map(m => m.genre).filter(Boolean))];

  const filteredMovies = movies.filter(movie => {
    return selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
  });
 










  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Načítám...</div>;

  return (
    <main style={{ padding: '40px', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
          <div>

<button 
  onClick={() => {
    if (isFilterOpen) {
      setIsFilterOpen(false); // Zavře výběr filtru
      setSelectedGenres([]);  // zruší filtry
    } else {
      setIsFilterOpen(true);  // otevře filtry
    }
  }}
  style={{ backgroundColor: '#2c3e50', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
>
  {isFilterOpen ? '✖ Zrušit filtry' : '🔍 Filtrovat'}
</button>
          </div>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '32px', textAlign: 'center' }}>
            <strong>Filmy v databázi</strong>
          </h1>
          <div style={{ textAlign: 'right' }}>
            <Link href="/movies/new" style={{ backgroundColor: '#0070f3', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
              + Přidat film
            </Link>
          </div>

        </header>


{isFilterOpen && (
  <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '30px' }}>
    <h3>Kategorie</h3>
    <h4>Žánr</h4>
    
    <div style={{ display: 'flex', gap: '10px' }}>
      {allGenres.map(genre => (
        <label key={genre}>
          <input 
            type="checkbox"
            checked={selectedGenres.includes(genre)}
            onChange={() => handleGenreChange(genre)}
            style={{ 
              width: '18px',  
              height: '18px',  // zvetseni checkboxu at neni trpajzlík
              cursor: 'pointer' // aby věděli podvědomě i dmenti že je to klikatelné
            }}
          />
          {genre}
        </label>
      ))}
    </div>
  </div>
)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', alignItems: 'stretch' }}>
          {filteredMovies?.map((movie) => (
            <div key={movie.id} style={{ position: 'relative' }}>
              
              <button 
                onClick={(e) => toggleFavorite(e, movie.id, movie.is_favorite)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '28px',
                  zIndex: 20, 
                  padding: 0,
                  lineHeight: 1
                }}
              >
                <span style={{
                  color: movie.is_favorite ? '#fdd32a' : '#e0e0e0',
                  transition: 'all 0.2s ease'
                }}>
                  ★
                </span>
              </button>

              <Link href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #e1e8ed',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '100%',
                  minHeight: '220px'
                }}>
                  <div>
                     
                    <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a', fontSize: '20px', paddingRight: '35px' }}> {/* right padding - text nenarazí do hvězdičky*/ }
                      {movie.title}
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                      <strong>Režisér:</strong> {movie.director}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', color: '#888' }}>
                      <span>📅 {movie.year}</span>
                      <span>⏱️ {movie.duration}</span>
                      <span>🎭 {movie.genre}</span>
                    </div>
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee', fontWeight: 'bold', color: '#f39c12' }}>
                      Hodnocení: {movie.rating} / 10 ⭐️
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {(!movies || movies.length === 0) && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#95a5a6' }}>
            <p>ŽÁDNÉ FILMY SE V NAŠÍ DATABÁZI NENACHÁZÍ......</p>
            <p>PŘIDEJ PRVNÍ FILM</p>
          </div>
        )}
      </div>
    </main>
  );
}