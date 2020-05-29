/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import Document from '../../src/xml/Document';

describe('Document', () => {
  it('reads schema', () => {
    Document.load('<!DOCTYPE schema [<!ENTITY test "abc">]><root/>');
  });
});
