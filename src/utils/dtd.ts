/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS } from '../translations/en';

export function parseLiteral(literal: string): string {
  literal = literal.trim();
  literal = literal.substr(1, literal.length - 2);
  return literal;
}

export function extractMarkup(dtd: string, start = 0): [string, number] | null {
  let c = '';
  let s = -1;
  while (start < dtd.length) {
    c = dtd[start++];
    if (-1 == s && ('%' == c || '&' == c)) {
      const i = dtd.indexOf(';', start);
      if (-1 == i) throw new Error(TEXTS.errInvalidDeclaration);
      return [dtd.substring(start, i), i + 1];
    } else if ('<' == c) {
      s = start;
    } else if ('>' == c) {
      if (-1 == s) throw new Error(TEXTS.errInvalidDeclaration);
      if ('!' == dtd[s] && '-' == dtd[s + 1] && '-' == dtd[s + 2]) {
        if ('-' == dtd[start - 2] && '-' == dtd[start - 3]) {
          s = -1;
          continue;
        }
        throw new Error(TEXTS.errInvalidDeclaration);
      }
      return [dtd.substring(s, start - 1), start];
    }
  }
  return null;
}
