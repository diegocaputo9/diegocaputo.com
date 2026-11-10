// Full-screen viewers grow out of the thing that opened them and shrink back
// into it on close: the dialog's transform-origin is set to the trigger's
// centre (see .press-dialog in globals.css). The dialog fills the viewport,
// so viewport coordinates are dialog coordinates.
export function setDialogOrigin(dialog: HTMLElement | null, trigger: Element | null | undefined) {
  if (!dialog) return;
  const r = trigger?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
  const y = r ? r.top + r.height / 2 : window.innerHeight / 2;
  dialog.style.setProperty("--origin", `${Math.round(x)}px ${Math.round(y)}px`);
}
