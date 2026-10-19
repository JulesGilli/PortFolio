import { useEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Open dialogs, innermost last: only the top one traps Tab. */
const stack: HTMLElement[] = [];

/** True when `el` is the innermost open dialog: keyboard shortcuts of the dialogs below must not fire. */
export const isTopDialog = (el: HTMLElement | null) => !!el && stack[stack.length - 1] === el;

/**
 * Modal focus: moves focus into the dialog when it opens (onto its `data-autofocus` element,
 * else the dialog itself; never use autoFocus, it would steal the element to restore), keeps
 * Tab inside it when `trap` is set, and gives focus back to whatever had it before on close.
 */
export function useDialogFocus(ref: React.RefObject<HTMLElement>, active = true, trap = true) {
  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const previous = document.activeElement as HTMLElement | null;
    (el.querySelector<HTMLElement>('[data-autofocus]') ?? el).focus({ preventScroll: true });
    stack.push(el);

    const onKey = (e: KeyboardEvent) => {
      if (!trap || e.key !== 'Tab' || stack[stack.length - 1] !== el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const inside = el.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const i = stack.lastIndexOf(el);
      if (i >= 0) stack.splice(i, 1);
      if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [ref, active, trap]);
}
