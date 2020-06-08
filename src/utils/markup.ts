/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DeclarationException, InvalidEntity } from '..';

export function parseLiteral(literal: string): string {
  literal = literal.trim();
  literal = literal.substr(1, literal.length - 2);
  return literal;
}

export function decompose(markup: string) {
  let match: RegExpExecArray | null;
  let matches = [] as string[];
  const regex = /'[^']+'|"[^"]+"|[^\s<>\/=]+/g;
  while ((match = regex.exec(markup))) matches.push(match[0]);
  return matches;
}

export function extractBlock(dtd: string, start = 0): [string, number] {
  let c = dtd[start];
  let nest = -1;
  let i = start;
  for (; i < dtd.length; i++) {
    c = dtd[i];
    if ('<' == c) nest++;
    else if ('>' == c) {
      if (0 == nest) {
        return [dtd.substr(start, i + 1), i + 1];
      }
      nest--;
    }
  }
  const substr =
    i - start > 40
      ? dtd.substring(start, i)
      : dtd.substr(start, 20) + ' ... ' + dtd.substring(i - 20, i);
  throw new DeclarationException(substr, dtd);
}

// noinspection OverlyComplexFunctionJS,FunctionTooLongJS
export function extractMarkup(dtd: string, start = 0): [string, number] | null {
  let c = '';
  let ps = -1;
  let pe = start;
  let nested = -1;
  while (pe < dtd.length) {
    c = dtd[pe++];
    if (-1 == ps && ('%' == c || '&' == c)) {
      let i = dtd.indexOf(';', pe);
      if (-1 == i) {
        let es = dtd.substr(pe);
        if (es.length > 10) es = es.substr(0, 10) + '...';
        throw new InvalidEntity(es, dtd);
      }
      return [dtd.substring(pe - 1, ++i), i];
    } else if ('<' == c) {
      ps = pe;
      nested++;
      // conditional sections
      if ('!' == dtd[ps] && '[' == dtd[ps + 1]) {
        const [block, e] = extractBlock(dtd, ps - 1);
        if (block.endsWith(']]>')) {
          pe = e;
          // ignore CDATA
          if (block.startsWith('<![CDATA[')) {
            ps = -1;
            continue;
          }
          return [block, pe];
        }
        throw new DeclarationException(block, dtd);
      }
    } else if ('>' == c) {
      if (-1 == ps) {
        throw new DeclarationException(dtd.substring(start, pe), dtd);
      }
      if (nested > 0) {
        nested--;
        continue;
      }
      // ignore process instructions
      if ('?' == dtd[ps]) {
        if ('?' == dtd[pe - 2]) {
          ps = -1;
          continue;
        }
        throw new DeclarationException(dtd.substring(ps - 1, pe), dtd);
      }
      // ignore comments
      if ('!' == dtd[ps] && '-' == dtd[ps + 1] && '-' == dtd[ps + 2]) {
        if ('-' == dtd[pe - 2] && '-' == dtd[pe - 3]) {
          ps = -1;
          continue;
        }
        throw new DeclarationException(dtd.substring(ps - 1, pe), dtd);
      }
      return [dtd.substring(ps - 1, pe), pe];
    }
  }
  return null;
}
