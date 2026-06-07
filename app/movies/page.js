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
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); 

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
    const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(movie.genre);
    
    // koukne jestli jsou favorite
    const matchFavorite = showFavoritesOnly ? movie.is_favorite === true : true;
    
    // Film projde jen tehdy, když splňuje obě podmínky
    return matchGenre && matchFavorite;
  });










  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Načítám...</div>;

  return (
    <main style={{ padding: '40px', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
<div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>        
        <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
          <div>

<button 
  onClick={() => {
    if (isFilterOpen) {
      setIsFilterOpen(false); // Zavře výběr filtru
      setSelectedGenres([]);  // zruší filtry
      setShowFavoritesOnly(false); // zruší zobrazení jen oblíbených
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



{/* rozdělení obrazovky na main a na filtr*/}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', width: '100%' }}>
          
          {/*Filtr*/}
          {isFilterOpen && (
            <aside style={{ width: '250px', flexShrink: 0, backgroundColor: 'white', padding: '30px', borderRadius: '12px', position: 'sticky', top: '40px' }}>
              
              {/* Obří rozklikávací nadpis pro Žánry */}
              <button 
                onClick={() => setIsGenreOpen(!isGenreOpen)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '0', cursor: 'pointer', fontSize: '26px', fontWeight: '900', color: '#1a1a1a' }}
              >
                Žánry 
                <span style={{ fontSize: '18px', color: '#0070f3' }}>
                  {isGenreOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Samotné checkboxy pod sebou , ukazou se když je rozkliklej trojuhelnicek */}
              {isGenreOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px', paddingLeft: '5px' }}>
                  {allGenres.map(genre => (
                    <label key={genre} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', fontSize: '18px', fontWeight: '500', color: '#333' }}>
                      <input 
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#0070f3' }}
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              )}

                    {/*filtr pro favorite */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f4f7f6' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', fontSize: '20px', fontWeight: '900', color: '#1a1a1a' }}>
                  <input 
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#fdd32a' }}
                  />
                  ⭐️ Oblíbené
                </label>
              </div>

            </aside>

          )}

          {/* zobrazení filmů*/}
          <div style={{ flex: 1, minWidth: 0 }}>
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
      </div>
       </div>
       
    </main>
  );
}