/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { readFile } from 'fs';
import { join } from 'path';
import { TFetchFn } from '../src';

export function createFetchFn(): TFetchFn {
  const base = join(__dirname, 'data/dtd/xhtml');
  return uri => {
    return new Promise((solve, reject) => {
      readFile(join(base, uri), { encoding: 'utf-8' }, (err, res: string) => {
        if (err) reject(err);
        solve(res);
      });
    });
  };
}
