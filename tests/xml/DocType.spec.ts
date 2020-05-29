/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import DocType from '../../src/xml/DocType';

describe('DOCTYPE', () => {
  describe('!Entity', () => {
    it('should parse internal entity', () => {
      const doctype = new DocType('schema [\n  <!ENTITY ncname "\\i\\c*">\n ]');
      expect(doctype.getEntity('ncname').value).toBe('\\i\\c*');
      // expect(doctype.getEntity('test')).toBe('val');
    });
  });
});
