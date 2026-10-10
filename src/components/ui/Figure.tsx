import { shotSrc, type Shot, type Slug } from '../../data/games';

/**
 * A printed figure: real gameplay capture, hard edge, 1px rule, numbered caption.
 * Never displayed above its native width; served as WebP 800/1600 with srcset.
 */
export function Figure({
  slug,
  shot,
  n,
  caption,
  sizes = '(min-width: 1024px) 888px, 100vw',
  priority = false,
  className = '',
}: {
  slug: Slug;
  shot: Shot;
  n?: number;
  caption?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="border border-ink bg-ink" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
        <img
          src={shotSrc(slug, shot, 1600)}
          srcSet={`${shotSrc(slug, shot, 800)} 800w, ${shotSrc(slug, shot, 1600)} 1600w`}
          sizes={sizes}
          width={shot.w}
          height={shot.h}
          alt={caption ?? ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          className="h-full w-full object-cover"
          style={{ maxWidth: shot.w }}
        />
      </div>
      {caption && (
        <figcaption className="t-meta ink2 mt-3 max-w-[70ch]">
          {n !== undefined && <span className="text-ink">Fig. {n} — </span>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
