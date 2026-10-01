import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export function useSeo({ title, description, image, url }: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const formattedTitle = title.includes('PrepUnite') ? title : `${title} – PrepUnite`;
    document.title = formattedTitle;

    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const fullTitle = document.title;
    setMeta('property', 'og:title', fullTitle);
    setMeta('name', 'twitter:title', fullTitle);

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://prepunite.com');
    setMeta('property', 'og:url', currentUrl);

    if (image) {
      const fullImg = image.startsWith('http')
        ? image
        : `${typeof window !== 'undefined' ? window.location.origin : 'https://prepunite.com'}${image}`;
      setMeta('property', 'og:image', fullImg);
      setMeta('property', 'og:image:secure_url', fullImg);
      setMeta('name', 'twitter:image', fullImg);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, image, url]);
}
