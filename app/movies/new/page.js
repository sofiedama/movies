'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const movieData = {
      title: formData.get('title'),
      director: formData.get('director'),
      year: parseInt(formData.get('year')),
      genre: formData.get('genre'),
      rating: formData.get('rating') ? parseFloat(formData.get('rating')) : null,
      duration: formData.get('duration') || null,
    };

    const { error } = await supabase.from('movies').insert([movieData]);

    if (error) {
      alert('Chyba: ' + error.message);
      setLoading(false);
    } else {
      router.push('/movies');
      router.refresh();
    }
  }

  return (
    <main style={{ 
      padding: '60px 20px', 
      fontFamily: 'Segoe UI, Roboto, sans-serif', 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #e1e8ed'
      }}>
        
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>
         <strong> Přidat nový film</strong>
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelS}>Název filmu</label>
            <input name="title" required style={inputS} />
          </div>

          <div>
            <label style={labelS}>Režisér</label>
            <input name="director" required style={inputS} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelS}>Rok</label>
              <input name="year" type="number" required style={inputS} />
            </div>
            <div>
              <label style={labelS}>Délka</label>
              <input name="duration" style={inputS} />
            </div>
          </div>

          <div>
            <label style={labelS}>Žánr</label>
            <input name="genre" style={inputS} />
          </div>

          <div>
            <label style={labelS}>Hodnocení (1-10⭐️)</label>
            <input name="rating" type="number" step="0.1" style={inputS} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '14px', 
              backgroundColor: '#3d9800', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Ukládám...' : 'Uložit do databáze'}
          </button>

          <Link href="/movies" style={{ color: '#95a5a6', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
            Zrušit a zpět
          </Link>

        </form>
      </div>
    </main>
  );
}

const labelS = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#7f8c8d'
};

const inputS = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e1e8ed',
  fontSize: '16px',
  boxSizing: 'border-box',
  outline: 'none',
  backgroundColor: '#f9f9f9',
  color: '#333'
};