/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import * as moxios from 'moxios';
import DocType from '../../src/xml/DocType';

describe('Basics', () => {
  let doctype: DocType;

  beforeEach(() => {
    doctype = new DocType();
  });

  it('should parse root element', async () => {
    await doctype.parse('root []');
    expect(doctype.rootElement).toBe('root');
  });

  it('should parse internal subset', async () => {
    await doctype.parse('root [\n  <!ENTITY ncname "\\i\\c*">\n ]');
    expect(doctype.getEntity('ncname').value).toBe('\\i\\c*');
  });

  it('should parse internal subset containing comment', async () => {
    await doctype.parse(`root [
      <!ENTITY test1 "val1">
      <!-- comment -->
      <!ENTITY test2 "val2">
     ]`);
    expect(doctype.getEntity('test1').value).toBe('val1');
    expect(doctype.getEntity('test2').value).toBe('val2');
  });
});

describe('Externals', function () {
  let doctype: DocType;

  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/http:\/\/example\.com\/base\/.+/i, {
      status: 200,
      responseText: `
        <!ENTITY test1 "val1">
        <!-- comment -->
        <!ENTITY test2 "val2">
        `,
    });
    doctype = new DocType('http://example.com/base');
  });

  afterEach(function () {
    moxios.uninstall();
  });

  it('should parse private external ID', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: '<!ENTITY test1 "val1"><!--ccc--><!ENTITY test2 "val2">',
        })
        .then(() => {
          expect(doctype.getEntity('test1').value).toBe('val1');
          expect(doctype.getEntity('test2').value).toBe('val2');
        });
    });
    await doctype.parse('root SYSTEM "DTD_location"');
  });
});
