/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DocType } from '../../src';

describe('Internals', () => {
  let doctype: DocType;

  beforeEach(() => {
    doctype = new DocType();
  });

  it('should parse root element', async () => {
    expect.assertions(1);
    await doctype.parse('root [ ]');
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
  it('should parse private external ID', async () => {
    expect.assertions(3);
    const doctype = new DocType({
      urlBase: 'http://example.com/base',
      fetchFn: url => {
        expect(url).toBe('http://example.com/base/DTD_location');
        return Promise.resolve(
          '<!ENTITY test1 "val1"><!--ccc--><!ENTITY test2 "val2">',
        );
      },
    });
    await doctype.parse('root SYSTEM "DTD_location"');
    expect(await doctype.getEntity('test1').value).toBe('val1');
    expect(await doctype.getEntity('test2').value).toBe('val2');
  });

  it('should parse public external ID', async () => {
    expect.assertions(3);
    const doctype = new DocType({
      urlBase: 'http://example.com/base',
      fetchFn: url => {
        expect(url).toBe('http://example.com/base/DTD_location');
        return Promise.resolve(
          '<!ENTITY test1 "val1"><!----><!ENTITY test2 "val2">',
        );
      },
    });
    await doctype.parse('root PUBLIC "DTD_name" "DTD_location"');
    expect(await doctype.getEntity('test1').value).toBe('val1');
    expect(await doctype.getEntity('test2').value).toBe('val2');
  });

  it('should parse mixed', async () => {
    expect.assertions(2);
    const doctype = new DocType({
      urlBase: 'http://example.com/base',
      fetchFn: url => {
        expect(url).toBe('http://example.com/base/DTD_location');
        return Promise.resolve('<!ENTITY test "abc">');
      },
    });
    await doctype.parse(
      'root PUBLIC "DTD_name" "DTD_location" [<!ENTITY test "abc">]',
    );
    expect(await doctype.getEntity('test').value).toBe('abc');
  });
});

describe('Real world samples', () => {
  it('should parse XHTML transitional', async () => {
    jest.setTimeout(50000);
    await new DocType({ urlBase: 'http://www.w3.org/TR/REC-html40' })
      .parse(`HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"
  "http://www.w3.org/TR/REC-html40/loose.dtd"`);
  });
});
