/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import moxios = require('moxios');
import { DocType } from '../../src';

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
    expect(await doctype.getEntity('ncname').value).toBe('\\i\\c*');
  });

  it('should parse internal subset containing comment', async () => {
    expect.assertions(2);
    await doctype.parse(`root [
      <!ENTITY test1 "val1">
      <!-- comment -->
      <!ENTITY test2 "val2">
     ]`);
    expect(await doctype.getEntity('test1').value).toBe('val1');
    expect(await doctype.getEntity('test2').value).toBe('val2');
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
    expect.assertions(4);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).toBe('DTD_location');
      expect(request.config.baseURL).toBe('http://example.com/base');
      request
        .respondWith({
          status: 200,
          response: '<!ENTITY test1 "val1"><!--ccc--><!ENTITY test2 "val2">',
        })
        .then(async () => {
          expect(await doctype.getEntity('test1').value).toBe('val1');
          expect(await doctype.getEntity('test2').value).toBe('val2');
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
        .then(async () => {
          expect(await doctype.getEntity('test1').value).toBe('val1');
          expect(await doctype.getEntity('test2').value).toBe('val2');
          done();
        });
    });
    await doctype.parse('root PUBLIC "DTD_name" "DTD_location"');
  });
});
