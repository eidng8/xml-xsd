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

export function extractBlock(dtd: string, start = 0): [string, number] {
  let c = dtd[start];
  let nest = -1;
  for (let i = start; i < dtd.length; i++) {
    c = dtd[i];
    if ('<' == c) nest++;
    else if ('>' == c) {
      if (0 == nest) {
        return [dtd.substring(start, i), i];
      }
      nest--;
    }
  }
  throw new Error(TEXTS.errInvalidDeclaration);
}

export function extractMarkup(dtd: string, start = 0): [string, number] | null {
  let c = '';
  let p = -1;
  while (start < dtd.length) {
    c = dtd[start++];
    if (-1 == p && ('%' == c || '&' == c)) {
      const i = dtd.indexOf(';', start);
      if (-1 == i) {
        throw new Error(TEXTS.errInvalidDeclaration);
      }
      return [dtd.substring(start, i), i + 1];
    } else if ('<' == c) {
      p = start;
      // conditional sections
      if ('!' == dtd[p] && '[' == dtd[p + 1]) {
        const [block, e] = extractBlock('<' + dtd, p);
        if (block.endsWith(']]')) {
          start = e;
          // ignore CDATA
          if (block.startsWith('<![CDATA[')) {
            p = -1;
            continue;
          }
          return [block.substr(1), start];
        }
        throw new Error(TEXTS.errInvalidDeclaration);
      }
    } else if ('>' == c) {
      if (-1 == p) {
        throw new Error(TEXTS.errInvalidDeclaration);
      }
      // ignore process instructions
      if ('?' == dtd[p]) {
        if ('?' == dtd[start - 2]) {
          p = -1;
          continue;
        }
        throw new Error(TEXTS.errInvalidDeclaration);
      }
      // ignore comments
      if ('!' == dtd[p] && '-' == dtd[p + 1] && '-' == dtd[p + 2]) {
        if ('-' == dtd[start - 2] && '-' == dtd[start - 3]) {
          p = -1;
          continue;
        }
        throw new Error(TEXTS.errInvalidDeclaration);
      }
      return [dtd.substring(p, start - 1), start];
    }
  }
  return null;
}
