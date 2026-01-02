import introContent from '@/content/intro.json';
import transitionsContent from '@/content/transitions.json';

type ImageKeyOwner = { imageKey?: string };

const introImages = (introContent.slides ?? [])
  .map((slide: ImageKeyOwner) => slide.imageKey)
  .filter((key): key is string => Boolean(key))
  .map((key) => `/assets/${key}`);

const transitionImages = Object.values(transitionsContent.transitions ?? {})
  .map((transition: ImageKeyOwner) => transition.imageKey)
  .filter((key): key is string => Boolean(key))
  .map((key) => `/assets/${key}`);

export const BEAKER_IMAGE_URLS = Array.from(
  new Set([...introImages, ...transitionImages])
);
