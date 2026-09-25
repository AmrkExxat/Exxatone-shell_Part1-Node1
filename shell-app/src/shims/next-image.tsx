import { forwardRef, type ImgHTMLAttributes } from 'react';

/**
 * Shim for `next/image`.
 *
 * Renders a plain <img>. Next's optimisation pipeline (loader, srcset
 * generation, blur placeholders) has no equivalent in a Vite SPA, so those
 * props are accepted and ignored rather than silently changing behaviour.
 * `fill` is translated to absolute positioning, which is what Next does.
 */
export interface NextImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
}

export const Image = forwardRef<HTMLImageElement, NextImageProps>(
  function Image(props, ref) {
    const {
      src,
      alt,
      width,
      height,
      fill,
      priority,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      loader: _loader,
      style,
      ...rest
    } = props;

    const resolved = typeof src === 'string' ? src : src.src;

    return (
      <img
        ref={ref}
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : rest.loading}
        style={
          fill
            ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
            : style
        }
        {...rest}
      />
    );
  },
);

export default Image;
