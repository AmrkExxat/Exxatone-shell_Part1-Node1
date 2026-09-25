/** Factory for Zustand stores scoped per React mount (context + ref). */

import { createStore, useStore, type StoreApi } from 'zustand';
import React, { createContext, useContext, useRef, type ReactNode } from 'react';

export interface ScopedStoreResult<TState> {
  Provider: React.FC<{ children: ReactNode; initial?: Partial<TState> }>;
  useSlice: <U>(selector: (state: TState) => U, equalityFn?: (a: U, b: U) => boolean) => U;

  useStoreApi: () => StoreApi<TState>;
  Context: React.Context<StoreApi<TState> | null>;
}

type StoreInitializer<TState> = (
  set: StoreApi<TState>['setState'],
  get: StoreApi<TState>['getState'],
  api: StoreApi<TState>
) => TState;

function createScopedStore<TState>(
  storeInitializer: StoreInitializer<TState>
): ScopedStoreResult<TState> {
  const Context = createContext<StoreApi<TState> | null>(null);

  const Provider: React.FC<{ children: ReactNode; initial?: Partial<TState> }> = ({
    children,
    initial,
  }) => {
    // Using a ref ensures the store is created only once per mount,
    // even in React Strict Mode's double-invoke.
    const storeRef = useRef<StoreApi<TState>>(null!);

    if (!storeRef.current) {
      storeRef.current = createStore<TState>()(storeInitializer);
      if (initial) {
        storeRef.current.setState(initial);
      }
    }

    return React.createElement(Context.Provider, { value: storeRef.current }, children);
  };

  const useStoreApi = (): StoreApi<TState> => {
    const store = useContext(Context);
    if (!store) {
      throw new Error(
        '[createScopedStore] useSlice / useStoreApi must be called inside the matching Provider.'
      );
    }
    return store;
  };

  // ── useSlice ─────────────────────────────────────────────────────────────
  const useSlice = <U>(selector: (state: TState) => U, equalityFn?: (a: U, b: U) => boolean): U => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(useStoreApi(), selector, equalityFn);
  };

  return { Provider, useSlice, useStoreApi, Context };
}

export { createScopedStore };
