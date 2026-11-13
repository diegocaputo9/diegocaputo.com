// Remembers where the visitor was on the home page, so "back home" links
// (Home, the name in the nav, the Diego Caputo button) return to that spot.
export const HOME_Y = "home:y";
export const HOME_RESTORE = "home:restore";

// Call from a click on a link to the home page. Returns true when a saved
// spot exists (the caller then navigates to "/" without a hash).
export function markHomeReturn(): boolean {
  try {
    if (sessionStorage.getItem(HOME_Y) === null) return false;
    sessionStorage.setItem(HOME_RESTORE, "1");
    return true;
  } catch {
    return false;
  }
}
