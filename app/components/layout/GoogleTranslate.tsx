'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ar', label: 'Arabic' },
  { code: 'ckb', label: 'Kurdish (Sorani)' },
  { code: 'tr', label: 'Turkish' },
  { code: 'en', label: 'English' },
];

export function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const openTranslate = (languageCode: string) => {
    const currentUrl = window.location.href;
    const targetUrl = `https://translate.google.com/translate?sl=auto&tl=${languageCode}&u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-emerald-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Globe className="w-3.5 h-3.5" />
        Translate
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white py-1 text-neutral-700 shadow-lg"
          role="menu"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => openTranslate(language.code)}
              role="menuitem"
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
