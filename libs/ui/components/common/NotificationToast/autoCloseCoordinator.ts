interface AutoCloseControls {
  pause: () => void;
  resume: () => void;
}

interface ContainerState {
  registrations: Map<string, AutoCloseControls>;
  stackPaused: boolean;
}

const containerStates = new Map<string, ContainerState>();

/** Applied to ToastContainer — used to locate the stack and bind hover listeners. */
export const STACK_CONTAINER_CLASS = 'exxat-notification-toast-stack';

function getContainerState(containerId: string): ContainerState {
  let state = containerStates.get(containerId);
  if (!state) {
    state = { registrations: new Map(), stackPaused: false };
    containerStates.set(containerId, state);
  }
  return state;
}

function findStackContainerElement(containerId: string): HTMLElement | null {
  const byClass = document.querySelector<HTMLElement>(
    `.${STACK_CONTAINER_CLASS}.${STACK_CONTAINER_CLASS}--${CSS.escape(containerId)}`
  );
  if (byClass) return byClass;

  const byId = document.getElementById(containerId);
  return byId?.querySelector<HTMLElement>('.Toastify__toast-container--top-right') ?? null;
}

function pauseAllInContainer(containerId: string): void {
  const state = getContainerState(containerId);
  if (state.stackPaused) return;
  state.stackPaused = true;
  state.registrations.forEach((controls) => controls.pause());
}

function resumeAllInContainer(containerId: string): void {
  const state = containerStates.get(containerId);
  if (!state?.stackPaused) return;
  state.stackPaused = false;
  state.registrations.forEach((controls) => controls.resume());
}

/** Each toast registers its pause/resume handlers; the stack container drives when to call them. */
export function registerAutoClose(
  containerId: string,
  toastId: string,
  controls: AutoCloseControls
): () => void {
  const state = getContainerState(containerId);
  state.registrations.set(toastId, controls);

  if (state.stackPaused) {
    controls.pause();
  }

  return () => {
    state.registrations.delete(toastId);
    if (state.registrations.size === 0) {
      containerStates.delete(containerId);
    }
  };
}

/** Pause/resume all toasts when the pointer enters or leaves the stacked toast container. */
export function bindStackHoverContainer(containerId: string, enabled: boolean): () => void {
  if (!enabled || typeof document === 'undefined') {
    return () => {};
  }

  let boundEl: HTMLElement | null = null;

  const onPointerEnter = () => {
    pauseAllInContainer(containerId);
  };

  const onPointerLeave = (event: PointerEvent) => {
    const related = event.relatedTarget as Node | null;
    if (related && boundEl?.contains(related)) return;
    resumeAllInContainer(containerId);
  };

  const detach = () => {
    if (!boundEl) return;
    boundEl.removeEventListener('pointerenter', onPointerEnter);
    boundEl.removeEventListener('pointerleave', onPointerLeave);
    boundEl = null;
  };

  const attach = (el: HTMLElement) => {
    if (boundEl === el) return;
    detach();
    boundEl = el;
    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointerleave', onPointerLeave);
  };

  const tryAttach = () => {
    const el = findStackContainerElement(containerId);
    if (el) attach(el);
  };

  tryAttach();

  const observer = new MutationObserver(tryAttach);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    detach();
    resumeAllInContainer(containerId);
  };
}
