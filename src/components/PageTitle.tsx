'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const formatTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';

    return segments
        .map(segment =>
            segment
                .replace(/-/g, ' ')                // convert kebab-case to space
                .replace(/\b\w/g, char => char.toUpperCase()) // capitalize each word
        )
        .join(' › '); // or ' / ' or any breadcrumb separator
};

export default function PageTitle() {
    const pathname = usePathname() || '/dashboard'; // default to '/dashboard' if pathname is empty

    const title = useMemo(() => formatTitle(pathname), [pathname]);

    return <h1 className="text-xl font-bold text-gray-800">{title}</h1>;
}
