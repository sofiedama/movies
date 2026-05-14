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
  const [isEditing, setIsEditing] = useState(false); // Stav pro přepnutí zobrazení/editace
  const [editedMovie, setEditedMovie] = useState({}); //  změny ve formuláři
  

  useEffect(() => {
    async function fetchMovie() {
      const { data } = await supabase
        .from('movies')
        .select('*')
        .eq('id', params.id)
        .single();
      setMovie(data);

      setEditedMovie(data); // předvyplníme data do editačního stavu

      setLoading(false);
    }
    fetchMovie();
  }, [params.id]);


// funkce pro úpravu formuláře
  async function handleUpdate(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('movies')
      .update(editedMovie)
      .eq('id', params.id);

    if (error) {
      alert('Chyba: ' + error.message);
    } else {
      setMovie(editedMovie); // aktualizuje text na stránce bez reloadu
      setIsEditing(false);   // zavře editační formulář
      router.refresh();
    }
  }
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
        
        {!isEditing && (
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

  
)}

{!isEditing && (
  <button 
    onClick={() => setIsEditing(true)}
    style={{ 
        position: 'absolute', 
        top: '20px', left: '20px', 
        backgroundColor: '#575f66', 
        color: 'white', 
        border: 'none', 
        padding: '8px 12px', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '14px', 
        fontWeight: 'bold' }}
  >
    Edit/Upravit
  </button>
)}
{isEditing ? (
    /* REŽIM ÚPRAV */
    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', marginTop: '20px' }}>Upravit údaje</h2>
      
      <label style={labelStyle}>Název filmu</label>
      <input style={inputStyle} value={editedMovie.title} onChange={(e) => setEditedMovie({...editedMovie, title: e.target.value})} />
      
      <label style={labelStyle}>Režisér</label>
      <input style={inputStyle} value={editedMovie.director} onChange={(e) => setEditedMovie({...editedMovie, director: e.target.value})} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelStyle}>Rok</label>
          <input style={inputStyle} type="number" value={editedMovie.year} onChange={(e) => setEditedMovie({...editedMovie, year: parseInt(e.target.value)})} />
        </div>
        <div>
          <label style={labelStyle}>Délka</label>
          <input style={inputStyle} value={editedMovie.duration || ''} onChange={(e) => setEditedMovie({...editedMovie, duration: e.target.value})} />
        </div>
      </div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
  <div>
    <label style={labelStyle}>Žánr</label>
    <input style={inputStyle} value={editedMovie.genre || ''} onChange={(e) => setEditedMovie({...editedMovie, genre: e.target.value})} />
  </div>
  <div>
    <label style={labelStyle}>Hodnocení (0-10)</label>
    <input 
      style={inputStyle} 
      type="number" 
      step="0.1" 
      min="0" 
      max="10" 
      value={editedMovie.rating || ''} 
      onChange={(e) => setEditedMovie({...editedMovie, rating: parseFloat(e.target.value)})} 
    />
  </div>
</div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ULOŽIT</button>
        <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ZRUŠIT</button>
      </div>
    </form>
  ) : (
    /* REŽIM ZOBRAZENÍ (původní detail) */
    <>
      <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#1a1a1a', marginTop: '20px' }}>{movie.title}</h1>
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
      
    </>
  )}
</div>
    </main>
  );
}const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#7f8c8d', marginBottom: '5px', display: 'block' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', width: '100%', boxSizing: 'border-box', color: '#333' };