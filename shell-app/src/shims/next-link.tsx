import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

/**
 * Shim for `next/link`.
 *
 * @exxat/ui is authored against Next.js, but this shell is a Vite SPA on
 * react-router. This maps Next's <Link href> API onto react-router's <Link to>,
 * and drops the Next-only props (prefetch, shallow, locale, …) that have no
 * meaning here.
 *
 * External/absolute hrefs and non-navigational schemes fall through to a plain
 * <a>, since react-router can only handle in-app paths.
 */
export interface NextLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname?: string; query?: Record<string, string> };
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
  children?: ReactNode;
}

function toPath(href: NextLinkProps['href']): string {
  if (typeof href === 'string') return href;
  const query = href.query
    ? `?${new URLSearchParams(href.query).toString()}`
    : '';
  return `${href.pathname ?? ''}${query}`;
}

const isExternal = (path: string) =>
  /^([a-z][a-z0-9+.-]*:)?\/\//i.test(path) ||
  /^(mailto:|tel:|sms:)/i.test(path);

export const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(
  function Link(props, ref) {
    const {
      href,
      replace,
      scroll: _scroll,
      prefetch: _prefetch,
      shallow: _shallow,
      passHref: _passHref,
      locale: _locale,
      children,
      ...rest
    } = props;

    const path = toPath(href);

    if (isExternal(path)) {
      return (
        <a ref={ref} href={path} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={path} replace={replace} {...rest}>
        {children}
      </RouterLink>
    );
  },
);

export default Link;
