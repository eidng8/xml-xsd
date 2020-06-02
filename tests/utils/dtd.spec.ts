/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { extractBlock, extractMarkup, TEXTS } from '../../src';

describe('extractBlock', function () {
  it('should throw if not well-formed', function () {
    expect.assertions(2);
    expect(() => extractBlock('adc>')).toThrow(TEXTS.errInvalidDeclaration);
    expect(() => extractBlock('<adc')).toThrow(TEXTS.errInvalidDeclaration);
  });
});

describe('extractMarkup', () => {
  it('should extract element declaration', function () {
    expect.assertions(8);
    expect(extractMarkup('<!ELEMENT foo (#PCDATA)>')).toEqual([
      '<!ELEMENT foo (#PCDATA)>',
      24,
    ]);
    expect(extractMarkup('<!ELEMENT img EMPTY>')).toEqual([
      '<!ELEMENT img EMPTY>',
      20,
    ]);
    expect(extractMarkup('<!ELEMENT tag ANY>')).toEqual([
      '<!ELEMENT tag ANY>',
      18,
    ]);
    expect(
      extractMarkup(
        '<!ELEMENT parent_name (child1_name,child2_name,child3_name)>',
      ),
    ).toEqual([
      '<!ELEMENT parent_name (child1_name,child2_name,child3_name)>',
      60,
    ]);
    expect(extractMarkup('<!ELEMENT parent_name (child_name?)>')).toEqual([
      '<!ELEMENT parent_name (child_name?)>',
      36,
    ]);
    expect(extractMarkup('<!ELEMENT parent_name (child_name*)>')).toEqual([
      '<!ELEMENT parent_name (child_name*)>',
      36,
    ]);
    expect(extractMarkup('<!ELEMENT parent_name (child_name+)>')).toEqual([
      '<!ELEMENT parent_name (child_name+)>',
      36,
    ]);
    expect(
      extractMarkup('<!ELEMENT parent_name (child1_name|child2_name)>'),
    ).toEqual(['<!ELEMENT parent_name (child1_name|child2_name)>', 48]);
  });

  it('should extract attribute declaration', function () {
    expect.assertions(5);
    expect(extractMarkup('<!ATTLIST image height CDATA #REQUIRED>')).toEqual([
      '<!ATTLIST image height CDATA #REQUIRED>',
      39,
    ]);
    expect(
      extractMarkup('<!ATTLIST code lang NOTATION (vrml) #REQUIRED>'),
    ).toEqual(['<!ATTLIST code lang NOTATION (vrml) #REQUIRED>', 46]);
    expect(
      extractMarkup('<!ATTLIST task status (important|normal) #REQUIRED>'),
    ).toEqual(['<!ATTLIST task status (important|normal) #REQUIRED>', 51]);
    expect(
      extractMarkup('<!ATTLIST task status (important|normal) "normal">'),
    ).toEqual(['<!ATTLIST task status (important|normal) "normal">', 50]);
    expect(
      extractMarkup('<!ATTLIST description xml:lang NMTOKEN #FIXED "en">'),
    ).toEqual(['<!ATTLIST description xml:lang NMTOKEN #FIXED "en">', 51]);
  });

  it('should extract entity declaration', function () {
    expect.assertions(8);
    expect(extractMarkup('&abc;')).toEqual(['&abc;', 5]);
    expect(extractMarkup('%abc;')).toEqual(['%abc;', 5]);
    expect(extractMarkup('<!ENTITY name "entity value">')).toEqual([
      '<!ENTITY name "entity value">',
      29,
    ]);
    expect(extractMarkup('<!ENTITY js "Jo Smith &email;">')).toEqual([
      '<!ENTITY js "Jo Smith &email;">',
      31,
    ]);
    expect(
      extractMarkup(
        '<!ENTITY c SYSTEM "http://www.xmlwriter.net/copyright.xml">',
      ),
    ).toEqual([
      '<!ENTITY c SYSTEM "http://www.xmlwriter.net/copyright.xml">',
      59,
    ]);
    expect(
      extractMarkup(`  <!ENTITY c PUBLIC "-//W3C//TEXT copyright//EN"
    "http://www.w3.org/xmlspec/copyright.xml">
`),
    ).toEqual([
      `<!ENTITY c PUBLIC "-//W3C//TEXT copyright//EN"
    "http://www.w3.org/xmlspec/copyright.xml">`,
      95,
    ]);
    expect(
      extractMarkup(
        '<!ENTITY logo SYSTEM "http://www.xmlwriter.net/logo.gif" NDATA gif>',
      ),
    ).toEqual([
      '<!ENTITY logo SYSTEM "http://www.xmlwriter.net/logo.gif" NDATA gif>',
      67,
    ]);
    expect(
      extractMarkup(
        `  <!ENTITY logo PUBLIC  "-//W3C//GIF logo//EN"
    "http://www.w3.org/logo.gif" NDATA gif>`,
      ),
    ).toEqual([
      `<!ENTITY logo PUBLIC  "-//W3C//GIF logo//EN"
    "http://www.w3.org/logo.gif" NDATA gif>`,
      90,
    ]);
  });

  it('should extract notation declaration', function () {
    expect.assertions(3);
    expect(
      extractMarkup('<!NOTATION gif SYSTEM "http://example.com">'),
    ).toEqual(['<!NOTATION gif SYSTEM "http://example.com">', 43]);
    expect(extractMarkup('<!NOTATION gif PUBLIC "gif viewer">')).toEqual([
      '<!NOTATION gif PUBLIC "gif viewer">',
      35,
    ]);
    expect(
      extractMarkup('<!NOTATION gif PUBLIC "gif viewer" "http://example.com">'),
    ).toEqual(['<!NOTATION gif PUBLIC "gif viewer" "http://example.com">', 56]);
  });

  it('should extract conditional section', function () {
    expect.assertions(3);
    expect(
      extractMarkup(`<![IGNORE[
<!ELEMENT book (title,author,summary)>
]]>`),
    ).toEqual([
      `<![IGNORE[
<!ELEMENT book (title,author,summary)>
]]>`,
      53,
    ]);
    expect(
      extractMarkup(`<![INCLUDE[
<!ELEMENT book (title,author,summary)>
]]>`),
    ).toEqual([
      `<![INCLUDE[
<!ELEMENT book (title,author,summary)>
]]>`,
      54,
    ]);
    expect(
      extractMarkup('<![%draft;[<!ELEMENT book (title,author,summary)>]]>'),
    ).toEqual(['<![%draft;[<!ELEMENT book (title,author,summary)>]]>', 52]);
  });

  it('should ignore CDATA', function () {
    expect.assertions(1);
    expect(extractMarkup('<![CDATA[a]]>%abc;')).toEqual(['%abc;', 18]);
  });

  it('should ignore comment', function () {
    expect.assertions(1);
    expect(extractMarkup('<!--a-->%abc;')).toEqual(['%abc;', 13]);
  });

  it('should ignore process instruction', function () {
    expect.assertions(1);
    expect(extractMarkup('<?a?>%abc;')).toEqual(['%abc;', 10]);
  });

  it('should throw on dangling ">"', function () {
    expect.assertions(1);
    expect(() => extractMarkup('adf>')).toThrow(TEXTS.errInvalidDeclaration);
  });

  it('should throw on invalid entity usage', function () {
    expect.assertions(2);
    expect(() => extractMarkup('&abc')).toThrow(TEXTS.errInvalidDeclaration);
    expect(() => extractMarkup('%abc')).toThrow(TEXTS.errInvalidDeclaration);
  });

  it('should throw on invalid CDATA', function () {
    expect.assertions(1);
    expect(() => extractMarkup('<![CDATA[a]>')).toThrow(
      TEXTS.errInvalidDeclaration,
    );
  });

  it('should throw on invalid comment', function () {
    expect.assertions(1);
    expect(() => extractMarkup('<!--a->')).toThrow(TEXTS.errInvalidDeclaration);
  });

  it('should throw on invalid process instruction', function () {
    expect.assertions(1);
    expect(() => extractMarkup('<?a>')).toThrow(TEXTS.errInvalidDeclaration);
  });
});
