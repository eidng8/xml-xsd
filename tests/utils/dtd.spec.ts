/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { extractMarkup } from '../../src/utils/dtd';

describe('extractMarkup', () => {
  it('should extract valid markup', function () {
    expect(extractMarkup('<abc>')).toEqual(['abc', 5]);
  });

  it('should extract general entity', function () {
    expect(extractMarkup('&abc;')).toEqual(['abc', 5]);
  });

  it('should extract parameter entity', function () {
    expect(extractMarkup('%abc;')).toEqual(['abc', 5]);
  });

  it('should ignore comment', function () {
    expect(extractMarkup('<!--a-->%abc;')).toEqual(['abc', 13]);
  });
});
