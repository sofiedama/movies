import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function MovieDetail({ params }) {
  
  const { id } = await params;

  // Načteme data pro 1 film
  const { data: movie } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();

  if (!movie) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Film s tímto ID nebyl nalezen</div>;
  }

  // ... (začátek souboru zůstává stejný až po return)

  return (
    <main style={{ 
      padding: '40px 20px', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        backgroundColor: '#ffffff', 
        padding: '40px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
        textAlign: 'center'
      }}>
        
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#1a1a1a' }}>
          {movie.title}
        </h1>
        <p style={{ color: '#444', fontSize: '18px', marginBottom: '30px' }}>
          Režisér: {movie.director}
        </p>
        
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '30px',
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          textAlign: 'left'
        }}>
          <div style={{ color: '#333' }}><strong>📅 Rok vydání:</strong> {movie.year}</div>
          <div style={{ color: '#333' }}><strong>⏱️ Délka:</strong> {movie.duration}</div>
          <div style={{ color: '#333' }}><strong>🎭 Žánr:</strong> {movie.genre}</div>
          <div style={{ color: '#333' }}><strong> Hodnocení: </strong> {movie.rating}/10 ⭐️</div>
        </div>

        <Link href="/movies" style={{ 
          marginTop: '40px', 
          display: 'inline-block', 
          color: '#0070f3', 
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
        ← Zpět na seznam
        </Link>
      </div>
    </main>
  );
}