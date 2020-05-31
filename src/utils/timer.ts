/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export let TIMER_RAPID = 10;

export function rapid(cb: () => void) {
  const iv = setInterval(() => {
    clearInterval(iv);
    cb();
  }, TIMER_RAPID);
}
