// Fixed page backdrop: faded engineering grid + slow-drifting grey blobs.
// The blobs give the glass surfaces something to refract.
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob blob-drift-1 left-[-10vw] top-[-12vh] h-[55vh] w-[55vh] bg-[var(--blob-a)]" />
      <div className="blob blob-drift-2 right-[-8vw] top-[18vh] h-[48vh] w-[48vh] bg-[var(--blob-c)]" />
      <div className="blob blob-drift-3 bottom-[-20vh] left-[30vw] h-[60vh] w-[60vh] bg-[var(--blob-b)]" />
      <div className="grid-backdrop absolute inset-0" />
    </div>
  );
}
