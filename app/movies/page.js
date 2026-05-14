import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function MoviesPage() {
  const { data: movies } = await supabase.from('movies').select('*');

  return (
    <main style={{ 
      padding: '40px', 
      fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <header style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '40px' 
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '32px' }}><strong>Filmy v databázi</strong></h1>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px',
          alignItems: 'stretch' 
        }}>
          {movies?.map((movie) => (
            <Link 
              href={`/movies/${movie.id}`} 
              key={movie.id} 
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e1e8ed',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%'
              }}>
                <div>
                  <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a', fontSize: '20px' }}>{movie.title}</h2>
                  <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                    <strong>Režisér:</strong> {movie.director}
                  </p>
                </div>

                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '20px', 
                    fontSize: '13px',
                    color: '#888' 
                  }}>
                    <span>📅 {movie.year}</span>
                    <span>⏱️ {movie.duration}</span>
                    <span>🎭 {movie.genre}</span>
                  </div>
                  <div style={{ 
                    marginTop: '15px', 
                    paddingTop: '10px', 
                    borderTop: '1px solid #eee',
                    fontWeight: 'bold',
                    color: '#f39c12'
                  }}>
                    Hodnocení: {movie.rating} / 10 ⭐️
                  </div>
                </div>
              </div>
            </Link>
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