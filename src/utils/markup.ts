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
  throw new DeclarationException(excerpt(dtd, start, i), dtd);
}

// noinspection OverlyComplexFunctionJS,FunctionTooLongJS
export function extractMarkup(dtd: string, start = 0): [string, number] | null {
  let c = dtd[start];
  let nested = -1;
  let i = start;
  for (; i < dtd.length; i++) {
    c = dtd[i];
    if ('<' == c) {
      if (nested > 0) {
        nested++;
        continue;
      } else if ('?' == dtd[i + 1]) {
        start = skipInstruction(dtd, i);
        i = start - 1;
        continue;
      } else if ('!' == dtd[i + 1]) {
        if ('-' == dtd[i + 2] && '-' == dtd[i + 3]) {
          start = skipComment(dtd, i);
          i = start - 1;
          continue;
        } else if ('[' == dtd[i + 2] && 'C' == dtd[i + 3]) {
          start = skipCData(dtd, i);
          i = start - 1;
          continue;
        }
      }
      nested++;
    } else if ('>' == c) {
      if (0 == nested) return [dtd.substring(start, i + 1).trim(), i + 1];
      nested--;
    } else if (-1 == nested) {
      if ('&' == c || '%' == c) {
        let ep = dtd.indexOf(';', i + 2);
        if (-1 == ep) throw new InvalidEntity(excerpt(dtd, i), dtd);
        return [dtd.substring(i, ++ep).trim(), ep];
      }
    }
  }
  if (-1 == nested) return null;
  throw new DeclarationException(excerpt(dtd, start, i), dtd);
}

function skipCData(dtd: string, start: number): number {
  let end = dtd.indexOf(']]>', start + 4);
  if (-1 == end || '<![CDATA[' != dtd.substr(start, 9)) {
    throw new DeclarationException(excerpt(dtd, start, end), dtd);
  }
  return end + 3;
}

function skipComment(dtd: string, start: number): number {
  let end = dtd.indexOf('-->', start + 4);
  if (-1 == end) throw new DeclarationException(excerpt(dtd, start, end), dtd);
  return end + 3;
}

function skipInstruction(dtd: string, start: number): number {
  let end = dtd.indexOf('?>', start + 2);
  if (-1 == end) throw new DeclarationException(excerpt(dtd, start, end), dtd);
  return end + 2;
}

function excerpt(dtd: string, start: number, end?: number): string {
  if (!end || end < 0) end = dtd.length;
  return end - start > 40
    ? dtd.substr(start, 20) + ' ... ' + dtd.substring(end - 20, end)
    : dtd.substring(start, end);
}
