/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { G8Xsd } from '../src';

describe('XSD', () => {
  it('reads schema', () => {
    const xsd = readFileSync(resolve(__dirname, './data/schema/rfc5261.xsd'), {
      encoding: 'utf-8',
    });
    new G8Xsd(xsd);
  });
});
