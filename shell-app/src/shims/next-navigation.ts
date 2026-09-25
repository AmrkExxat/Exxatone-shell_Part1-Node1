/**
 * Shim for `next/navigation`.
 *
 * Maps the Next App Router navigation hooks that @exxat/ui uses onto
 * react-router equivalents. Only the surface the library actually touches is
 * implemented — `usePathname` today — with the neighbouring hooks provided so
 * additional library components keep working as they get pulled in.
 */
import {
  useLocation,
  useNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from 'react-router';

export function usePathname(): string {
  return useLocation().pathname;
}

export function useSearchParams(): URLSearchParams {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function useParams<T = Record<string, string | undefined>>(): T {
  return useRouterParams() as T;
}

/** Next's `useRouter()` surface, backed by react-router's navigate(). */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => navigate(0),
    prefetch: () => {},
  };
}

export function redirect(href: string): never {
  window.location.assign(href);
  throw new Error(`redirect(${href})`);
}

export function notFound(): never {
  throw new Error('notFound()');
}
