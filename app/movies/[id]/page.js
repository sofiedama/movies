'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react'; // Přidali jsme use pro params

export default function MovieDetail({ params: paramsPromise }) {
  const params = use(paramsPromise); // Rozbalení params v Next.js 15
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Načtení dat (v Client Component musíme přes useEffect)
  useEffect(() => {
    async function fetchMovie() {
      const { data } = await supabase
        .from('movies')
        .select('*')
        .eq('id', params.id)
        .single();
      setMovie(data);
      setLoading(false);
    }
    fetchMovie();
  }, [params.id]);

  // Funkce pro smazání
  async function handleDelete() {
    const confirmDelete = confirm(`Opravdu chceš smazat film ${movie.title}?`);
    
    if (confirmDelete) {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', params.id);

      if (error) {
        alert('Chyba při mazání: ' + error.message);
      } else {
        router.push('/movies');
        router.refresh();
      }
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Načítám...</div>;
  if (!movie) return <div style={{ textAlign: 'center', padding: '50px' }}>Film nenalezen.</div>;

  return (
    <main style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', position: 'relative' }}>
        
        {/* Tlačítko smazat v rohu */}
        <button 
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          <strong>Smazat</strong>
        </button>

        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#1a1a1a' }}>{movie.title}</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>Režisér: {movie.director}</p>
        
        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', color: '#333' }}>
          <div><strong>Rok:</strong> {movie.year}</div>
          <div><strong>Délka:</strong> {movie.duration || 'Neznámo'}</div>
          <div><strong>Žánr:</strong> {movie.genre}</div>
          <div><strong>Hodnocení:</strong> {movie.rating ? `${movie.rating} / 10` : 'Teprve vyjde'}</div>
        </div>

        <Link href="/movies" style={{ marginTop: '40px', display: 'inline-block', color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Zpět na seznam
        </Link>
      </div>
    </main>
  );
}