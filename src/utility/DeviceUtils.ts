/**
 * Returns true if the current device is a mobile device, false if not.
 */
export function isMobile(): boolean {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    window.innerWidth < 700
  ) {
    return true;
  }
  return false;
}
