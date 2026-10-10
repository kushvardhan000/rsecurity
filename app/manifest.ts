import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ranchi Security Private Limited',
    short_name: 'RSPL',
    description: 'Private Security, Skill Training & Manpower',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#A6192E',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
