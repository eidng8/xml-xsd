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
    expect.assertions(1);
    await doctype.parse('root []');
    expect(doctype.rootElement).toBe('root');
  });

  it('should parse internal subset', async () => {
    expect.assertions(1);
    await doctype.parse('root [\n  <!ENTITY ncname "\\i\\c*">\n ]');
    expect(doctype.getEntity('ncname').value).toBe('\\i\\c*');
  });

  it('should parse internal subset containing comment', async () => {
    expect.assertions(2);
    await doctype.parse(`root [
      <!ENTITY test1 "val1">
      <!-- comment -->
      <!ENTITY test2 "val2">
     ]`);
    expect(doctype.getEntity('test1').value).toBe('val1');
    expect(doctype.getEntity('test2').value).toBe('val2');
  });
});

describe('Externals', () => {
  let doctype: DocType;

  beforeEach(() => {
    moxios.install();
    doctype = new DocType('http://example.com/base');
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should parse private external ID', async done => {
    expect.assertions(3);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).toBe('DTD_location');
      request
        .respondWith({
          status: 200,
          response: '<!ENTITY test1 "val1"><!--ccc--><!ENTITY test2 "val2">',
        })
        .then(() => {
          expect(doctype.getEntity('test1').value).toBe('val1');
          expect(doctype.getEntity('test2').value).toBe('val2');
          done();
        });
    });
    await doctype.parse('root SYSTEM "DTD_location"');
  });

  it('should parse public external ID', async done => {
    expect.assertions(3);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).toBe('DTD_location');
      request
        .respondWith({
          status: 200,
          response: '<!ENTITY test1 "val1"><!--ccc--><!ENTITY test2 "val2">',
        })
        .then(() => {
          expect(doctype.getEntity('test1').value).toBe('val1');
          expect(doctype.getEntity('test2').value).toBe('val2');
          done();
        });
    });
    await doctype.parse('root PUBLIC "DTD_name" "DTD_location"');
  });
});
