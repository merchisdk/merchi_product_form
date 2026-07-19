/** Scroll the first visible form error into view and focus its input. */
export function scrollToFirstFormError() {
  if (typeof document === 'undefined') return;

  const reveal = () => {
    const alert = document.querySelector(
      '.merchi-embed-form .input-alert-container, .input-alert-container'
    ) as HTMLElement | null;
    if (!alert) return;

    const container =
      (alert.closest(
        '.merchi-embed-form_product-group-input-qty-container, .merchi-embed-form_checkbox_radio-item, fieldset, .merchi-embed-form_variantion-container > div'
      ) as HTMLElement | null) || alert;

    container.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const input = container.querySelector(
      'input:not([type="hidden"]), select, textarea'
    ) as HTMLElement | null;
    if (input && typeof input.focus === 'function') {
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
    }
  };

  // Wait for React / RHF to paint error messages after trigger().
  requestAnimationFrame(() => {
    requestAnimationFrame(reveal);
  });
}
