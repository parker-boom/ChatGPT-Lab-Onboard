import { BEAKER_IMAGE_URLS } from '@/lib/preloadAssets';

export default function Head() {
  return (
    <>
      {BEAKER_IMAGE_URLS.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
    </>
  );
}
