/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { AttListDeclaration, EDtdAttributeType } from '../../src';

describe('Basics', () => {
  it('should parse CDATA type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST image height CDATA #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('image');
    const att = decl.list[0];
    expect(att.name).toBe('height');
    expect(att.type).toBe(EDtdAttributeType.cdata);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse ID type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST student_name student_no ID #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('student_name');
    const att = decl.list[0];
    expect(att.name).toBe('student_no');
    expect(att.type).toBe(EDtdAttributeType.id);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse IDREF type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST student_name tutor_1 IDREF #IMPLIED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('student_name');
    const att = decl.list[0];
    expect(att.name).toBe('tutor_1');
    expect(att.type).toBe(EDtdAttributeType.idref);
    expect(att.required).toBe(false);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse IDREFS type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST student_name tutor_1 IDREFS #IMPLIED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('student_name');
    const att = decl.list[0];
    expect(att.name).toBe('tutor_1');
    expect(att.type).toBe(EDtdAttributeType.idrefs);
    expect(att.required).toBe(false);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse ENTITY type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST results image ENTITY #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('results');
    const att = decl.list[0];
    expect(att.name).toBe('image');
    expect(att.type).toBe(EDtdAttributeType.entity);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse ENTITIES type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST results images ENTITIES #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('results');
    const att = decl.list[0];
    expect(att.name).toBe('images');
    expect(att.type).toBe(EDtdAttributeType.entities);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse NMTOKEN type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST student_name student_no NMTOKEN #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('student_name');
    const att = decl.list[0];
    expect(att.name).toBe('student_no');
    expect(att.type).toBe(EDtdAttributeType.nmtoken);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse NMTOKENS type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST student_name students NMTOKENS #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('student_name');
    const att = decl.list[0];
    expect(att.name).toBe('students');
    expect(att.type).toBe(EDtdAttributeType.nmtokens);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse NOTATION type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST code lang NOTATION (xml|vrml) #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('code');
    const att = decl.list[0];
    expect(att.name).toBe('lang');
    expect(att.type).toBe(EDtdAttributeType.notation);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toEqual(['xml', 'vrml']);
  });

  it('should parse enumerated type', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST task status (important|normal) #REQUIRED>',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('task');
    const att = decl.list[0];
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.enumerated);
    expect(att.required).toBe(true);
    expect(att.fixed).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumerable).toEqual(['important', 'normal']);
  });

  it('should parse default value', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST task status (important|normal) "normal">',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('task');
    const att = decl.list[0];
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.enumerated);
    expect(att.required).toBe(false);
    expect(att.fixed).toBe(false);
    expect(att.value).toBe('normal');
    expect(att.enumerable).toEqual(['important', 'normal']);
  });

  it('should parse fixed value', () => {
    expect.assertions(8);
    const decl = new AttListDeclaration(
      '<!ATTLIST task status NMTOKEN #FIXED "monthly">',
    ).parse();
    expect(decl.list.length).toBe(1);
    expect(decl.element).toBe('task');
    const att = decl.list[0];
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.nmtoken);
    expect(att.required).toBe(false);
    expect(att.fixed).toBe(true);
    expect(att.value).toBe('monthly');
    expect(att.enumerable).toBeUndefined();
  });

  it('should parse multiple attributes', () => {
    const decl = new AttListDeclaration(
      `<!ATTLIST transition
              autostart CDATA #FIXED "no"
              select CDATA #IMPLIED
              trigger CDATA #REQUIRED
              next IDREF #IMPLIED
              selection (random|one|choose) "one"
            >`,
    ).parse();
    const expected = [
      {
        name: 'autostart',
        type: EDtdAttributeType.cdata,
        required: false,
        fixed: true,
        value: 'no',
        enumerable: undefined,
      },
      {
        name: 'select',
        type: EDtdAttributeType.cdata,
        required: false,
        fixed: false,
        value: undefined,
        enumerable: undefined,
      },
      {
        name: 'trigger',
        type: EDtdAttributeType.cdata,
        required: true,
        fixed: false,
        value: undefined,
        enumerable: undefined,
      },
      {
        name: 'next',
        type: EDtdAttributeType.idref,
        required: false,
        fixed: false,
        value: undefined,
        enumerable: undefined,
      },
      {
        name: 'selection',
        type: EDtdAttributeType.enumerated,
        required: false,
        fixed: false,
        value: 'one',
        enumerable: ['random', 'one', 'choose'],
      },
    ];
    expect.assertions(2 + expected.length);
    expect(decl.list.length).toBe(expected.length);
    expect(decl.element).toBe('transition');
    for (let i = 0; i < expected.length; i++) {
      const att = decl.list[i];
      expect({
        name: att.name,
        type: att.type,
        required: att.required,
        fixed: att.fixed,
        value: att.value,
        enumerable: att.enumerable,
      }).toEqual(expected[i]);
    }
  });

  it('should throw on invalid enumerated value', () => {
    expect.assertions(1);
    expect(() =>
      new AttListDeclaration(
        '<!ATTLIST task status (important|normal) "invalid">',
      ).parse(),
    ).toThrow('Invalid value "invalid"');
  });
});
