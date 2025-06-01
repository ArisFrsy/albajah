'use client';

import dynamic from 'next/dynamic';

// Dynamically import CKEditor component only (React component)
export const CKEditor = dynamic(
    () => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
    { ssr: false }
);

// Import ClassicEditor normally (no dynamic needed, it doesn't run on SSR)
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export { ClassicEditor };
