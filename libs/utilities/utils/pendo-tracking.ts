/**
 * Pendo tracking utility
 * Provides a centralized method for tracking events in Pendo
 */

declare global {
  interface Window {
    pendo?: {
      track?: (eventName: string, metadata?: Record<string, any>) => void;
    };
  }
}

export interface PendoTrackingOptions {
  eventId: string;
  eventData?: Record<string, any>;
}

/**
 * Tracks an event in Pendo if available
 * @param eventId - The event identifier/name to track
 * @param eventData - Optional metadata to include with the event
 */
export const trackPendoEvent = (eventId: string, eventData?: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window?.pendo?.track) {
    try {
      window.pendo.track(eventId, eventData || {});
    } catch (error) {
      console.warn('Failed to track Pendo event:', error);
    }
  }
};

/**
 * Creates a wrapped click handler that tracks Pendo events before calling the original handler
 * @param originalHandler - The original click handler function
 * @param pendoEventId - Optional Pendo event ID to track
 * @param pendoEventData - Optional event data to pass to Pendo
 * @returns A new handler function that tracks and then calls the original handler
 */
export const createTrackedClickHandler = <T extends (...args: any[]) => any>(
  originalHandler: T | undefined,
  pendoEventId?: string,
  pendoEventData?: Record<string, any> | ((...args: Parameters<T>) => Record<string, any>)
): T | undefined => {
  if (!pendoEventId) {
    return originalHandler;
  }

  return ((...args: Parameters<T>) => {
    // Track Pendo event if window.pendo is available
    if (typeof window !== 'undefined' && window?.pendo?.track) {
      try {
        const eventData =
          typeof pendoEventData === 'function' ? pendoEventData(...args) : pendoEventData || {};
        window.pendo.track(pendoEventId, eventData);
      } catch (error) {
        console.warn('Failed to track Pendo event:', error);
      }
    }

    // Call the original handler if it exists
    if (originalHandler) {
      return originalHandler(...args);
    }
  }) as T;
};
