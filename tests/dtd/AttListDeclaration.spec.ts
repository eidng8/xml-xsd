/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { AttListDeclaration, EDtdAttributeType } from '../../src';

describe('Basics', () => {
  it('should parse CDATA type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST image height CDATA #REQUIRED>',
    ).parse();
    expect(att.element).toBe('image');
    expect(att.name).toBe('height');
    expect(att.type).toBe(EDtdAttributeType.cdata);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse ID type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST student_name student_no ID #REQUIRED>',
    ).parse();
    expect(att.element).toBe('student_name');
    expect(att.name).toBe('student_no');
    expect(att.type).toBe(EDtdAttributeType.id);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse IDREF type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST student_name tutor_1 IDREF #IMPLIED>',
    ).parse();
    expect(att.element).toBe('student_name');
    expect(att.name).toBe('tutor_1');
    expect(att.type).toBe(EDtdAttributeType.idref);
    expect(att.isRequired).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse IDREFS type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST student_name tutor_1 IDREFS #IMPLIED>',
    ).parse();
    expect(att.element).toBe('student_name');
    expect(att.name).toBe('tutor_1');
    expect(att.type).toBe(EDtdAttributeType.idrefs);
    expect(att.isRequired).toBe(false);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse ENTITY type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST results image ENTITY #REQUIRED>',
    ).parse();
    expect(att.element).toBe('results');
    expect(att.name).toBe('image');
    expect(att.type).toBe(EDtdAttributeType.entity);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse ENTITIES type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST results images ENTITIES #REQUIRED>',
    ).parse();
    expect(att.element).toBe('results');
    expect(att.name).toBe('images');
    expect(att.type).toBe(EDtdAttributeType.entities);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse NMTOKEN type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST student_name student_no NMTOKEN #REQUIRED>',
    ).parse();
    expect(att.element).toBe('student_name');
    expect(att.name).toBe('student_no');
    expect(att.type).toBe(EDtdAttributeType.nmtoken);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse NMTOKENS type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST student_name students NMTOKENS #REQUIRED>',
    ).parse();
    expect(att.element).toBe('student_name');
    expect(att.name).toBe('students');
    expect(att.type).toBe(EDtdAttributeType.nmtokens);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });

  it('should parse NOTATION type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST code lang NOTATION (xml|vrml) #REQUIRED>',
    ).parse();
    expect(att.element).toBe('code');
    expect(att.name).toBe('lang');
    expect(att.type).toBe(EDtdAttributeType.notation);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toEqual(['xml', 'vrml']);
    expect(att.pattern).toBeUndefined();
  });

  it('should parse enumerated type', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST task status (important|normal) #REQUIRED>',
    ).parse();
    expect(att.element).toBe('task');
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.enumerated);
    expect(att.isRequired).toBe(true);
    expect(att.value).toBeUndefined();
    expect(att.enumValues).toEqual(['important', 'normal']);
    expect(att.pattern).toBe('important|normal');
  });

  it('should parse default value', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST task status (important|normal) "normal">',
    ).parse();
    expect(att.element).toBe('task');
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.enumerated);
    expect(att.isRequired).toBe(false);
    expect(att.value).toBe('normal');
    expect(att.enumValues).toEqual(['important', 'normal']);
    expect(att.pattern).toBe('important|normal');
  });

  it('should parse default value', () => {
    expect.assertions(7);
    const att = new AttListDeclaration(
      '<!ATTLIST task status NMTOKEN #FIXED "monthly">',
    ).parse();
    expect(att.element).toBe('task');
    expect(att.name).toBe('status');
    expect(att.type).toBe(EDtdAttributeType.nmtoken);
    expect(att.isRequired).toBe(false);
    expect(att.value).toBe('monthly');
    expect(att.enumValues).toBeUndefined();
    expect(att.pattern).toBeUndefined();
  });
});
