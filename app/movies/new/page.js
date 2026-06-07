'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// podmínky pro ZOD
const movieSchema = z.object({
  title: z.string().min(1, 'Název je povinný'),
  director: z.string().min(1, 'Režisér je povinný'),
  year: z.coerce.number({ invalid_type_error: 'Musí být číslo' }).min(1800, 'Zadej platný rok'),
  genre: z.string().min(1, 'Žánr je povinný'), // Změněno na povinné
  duration: z.string().optional(),
  rating: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
    z.number().min(0, 'Minimálně 0').max(10, 'Maximálně 10').nullable().optional()
  ),
});

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(movieSchema)
  });

  async function onSubmit(data) {
    setLoading(true);

    const movieData = {
      title: data.title,
      director: data.director,
      year: data.year,
      genre: data.genre,
      rating: data.rating,
      duration: data.duration || null,
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
    <main style={{ padding: '60px 20px', fontFamily: 'Segoe UI, Roboto, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' }}>
        
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>
         <strong>Přidat nový film</strong>
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelS}>Název filmu</label>
            <input {...register('title')} style={inputS} />
            {errors.title && <p style={errorS}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={labelS}>Režisér</label>
            <input {...register('director')} style={inputS} />
            {errors.director && <p style={errorS}>{errors.director.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelS}>Rok</label>
              <input type="number" {...register('year')} style={inputS} />
              {errors.year && <p style={errorS}>{errors.year.message}</p>}
            </div>
            <div>
              <label style={labelS}>Délka</label>
              <input {...register('duration')} style={inputS} />
            </div>
          </div>

          <div>
            <label style={labelS}>Žánr</label>
            <input {...register('genre')} style={inputS} />
            {errors.genre && <p style={errorS}>{errors.genre.message}</p>}
          </div>

          <div>
            <label style={labelS}>Hodnocení (0-10⭐️)</label>
            <input type="number" step="0.1" {...register('rating')} style={inputS} />
            {errors.rating && <p style={errorS}>{errors.rating.message}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ padding: '14px', backgroundColor: '#3d9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            {loading ? 'Ukládám...' : 'Uložit'}
          </button>

          <Link href="/movies" style={{ color: '#95a5a6', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
            Zrušit a zpět
          </Link>
        </form>
      </div>
    </main>
  );
}

const labelS = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#7f8c8d' };
const inputS = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e1e8ed', fontSize: '16px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f9f9f9', color: '#333' };
const errorS = { color: 'red', fontSize: '12px', marginTop: '4px' };