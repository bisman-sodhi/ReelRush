'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationMenu() {
  const pathname = usePathname();
  
  const links = [
    { href: '/home', label: 'Home' },
    { href: '/following', label: 'Following' },
    { href: '/upload', label: 'Upload' },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 bg-white z-40 py-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 text-center py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-black text-white'
                  : 'bg-black/90 text-white hover:bg-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 