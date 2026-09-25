/**
 * Re-exports for consumers that need direct store access.
 *
 * Use `useOnboardingSlice` to subscribe to a precise slice of the store.
 * Use `useOnboardingStoreApi` for imperative reads/writes without subscribing.
 *
 * Both hooks must be called inside a component tree that is wrapped by
 * <OnboardingContainer> (which mounts the store Provider internally).
 *
 * Example — consumer's FaasRequirement reacting to the expand signal:
 *
 *   import { useOnboardingSlice } from '@exxat/ui';
 *
 *   const shouldExpand = useOnboardingSlice(s => s.shouldExpandNewRecord);
 *   const consumeExpand = useOnboardingSlice(s => s.consumeExpandNewRecord);
 *
 *   useEffect(() => {
 *     if (shouldExpand) {
 *       accordionRef.current?.open();
 *       consumeExpand();
 *     }
 *   }, [shouldExpand]);
 */

export { useOnboardingSlice, useOnboardingStoreApi, useOnboardingSliceSafe } from './store/store';
export type { OnboardingStore } from './store/store';
