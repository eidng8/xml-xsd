/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import DocType from '../../src/xml/DocType';
import Document from '../../src/xml/Document';
import { SAXParser } from 'sax';

describe('DOCTYPE', () => {
  describe('!Entity', () => {
    it('should parse internal entity', () => {
      const parser = new SAXParser();
      const doctype = new DocType({} as Document);
      doctype.parseEntity(parser, ['test', '"val"']);
      expect(parser.ENTITIES.test).toBe('val');
      expect(doctype.getEntity('test')).toBe('val');
    });
  });
});
