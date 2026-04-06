import { useEffect } from 'react';

const resolveImage = (image) => {
  if (!image) return '';
  if (image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return image.startsWith('/') ? `${backendUrl}${image}` : `${backendUrl}/${image}`;
};

export function useFavicon() {
  useEffect(() => {
    let mounted = true;

    const updateFavicon = async () => {
      try {
        const res = await fetch('/backend/shreeweb-navigation-menus/public', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        
        if (!mounted || !res.ok || !data?.success) return;
        
        const brand = data?.data?.navbarBrand;
        if (brand?.logoImageUrl) {
          const faviconUrl = resolveImage(brand.logoImageUrl);
          
          // Update favicon
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
        }

        // Update page title
        if (brand?.brandTitle) {
          document.title = `${brand.brandTitle}${brand.brandSubtitle ? ' - ' + brand.brandSubtitle : ''}`;
        }
      } catch (error) {
        console.error('Failed to load favicon:', error);
      }
    };

    updateFavicon();

    return () => {
      mounted = false;
    };
  }, []);
}
