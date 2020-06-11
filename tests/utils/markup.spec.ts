/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { extractBlock, extractMarkup, InvalidEntity, TEXTS } from '../../src';

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
    expect.assertions(2);
    expect(extractMarkup('<!--a-->%abc;')).toEqual(['%abc;', 13]);
    expect(extractMarkup('<!--a <a@b.com>-->%abc;')).toEqual(['%abc;', 23]);
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
    expect(() => extractMarkup('&abc')).toThrow(
      new InvalidEntity('&abc', '&abc'),
    );
    expect(() => extractMarkup('%abc')).toThrow(
      new InvalidEntity('%abc', '%abc'),
    );
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

  it('should extract complex markup', function () {
    const markup = `<!--
    This is the HTML 4.01 Transitional DTD, which includes
    presentation attributes and elements that W3C expects to phase out
    as support for style sheets matures. Authors should use the Strict
    DTD when possible, but may use the Transitional DTD when support
    for presentation attribute and elements is required.

    HTML 4 includes mechanisms for style sheets, scripting,
    embedding objects, improved support for right to left and mixed
    direction text, and enhancements to forms for improved
    accessibility for people with disabilities.

          Draft: $Date: 2018/04/05 15:13:09 $

          Authors:
              Dave Raggett <dsr@w3.org>
              Arnaud Le Hors <lehors@w3.org>
              Ian Jacobs <ij@w3.org>

    Further information about HTML 4.01 is available at:

        http://www.w3.org/TR/1999/REC-html401-19991224


    The HTML 4.01 specification includes additional
    syntactic constraints that cannot be expressed within
    the DTDs.

-->
<!ENTITY % HTML.Version "-//W3C//DTD HTML 4.01 Transitional//EN"
  -- Typical usage:

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
            "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    ...
    </head>
    <body>
    ...
    </body>
    </html>

    The URI used as a system identifier with the public identifier allows
    the user agent to download the DTD and entity sets as needed.

    The FPI for the Strict HTML 4.01 DTD is:

        "-//W3C//DTD HTML 4.01//EN"

    This version of the strict DTD is:

        http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd

    Authors should use the Strict DTD unless they need the
    presentation control for user agents that don't (adequately)
    support style sheets.

    If you are writing a document that includes frames, use
    the following FPI:

        "-//W3C//DTD HTML 4.01 Frameset//EN"

    This version of the frameset DTD is:

        http://www.w3.org/TR/1999/REC-html401-19991224/frameset.dtd

    Use the following (relative) URIs to refer to
    the DTDs and entity definitions of this specification:

    "strict.dtd"
    "loose.dtd"
    "frameset.dtd"
    "HTMLlat1.ent"
    "HTMLsymbol.ent"
    "HTMLspecial.ent"

-->

<!--================== Imported Names ====================================-->
<!-- Feature Switch for frameset documents -->
<!ENTITY % HTML.Frameset "IGNORE">

<!ENTITY % ContentType "CDATA"
    -- media type, as per [RFC2045]
    -->`;
    const expected = `<!ENTITY % HTML.Version "-//W3C//DTD HTML 4.01 Transitional//EN"
  -- Typical usage:

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
            "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    ...
    </head>
    <body>
    ...
    </body>
    </html>

    The URI used as a system identifier with the public identifier allows
    the user agent to download the DTD and entity sets as needed.

    The FPI for the Strict HTML 4.01 DTD is:

        "-//W3C//DTD HTML 4.01//EN"

    This version of the strict DTD is:

        http://www.w3.org/TR/1999/REC-html401-19991224/strict.dtd

    Authors should use the Strict DTD unless they need the
    presentation control for user agents that don't (adequately)
    support style sheets.

    If you are writing a document that includes frames, use
    the following FPI:

        "-//W3C//DTD HTML 4.01 Frameset//EN"

    This version of the frameset DTD is:

        http://www.w3.org/TR/1999/REC-html401-19991224/frameset.dtd

    Use the following (relative) URIs to refer to
    the DTDs and entity definitions of this specification:

    "strict.dtd"
    "loose.dtd"
    "frameset.dtd"
    "HTMLlat1.ent"
    "HTMLsymbol.ent"
    "HTMLspecial.ent"

-->`;
    expect(extractMarkup(markup)).toEqual([expected, 2244]);
  });
});
