import { AttListDeclaration, EDtdAttributeType } from '../../src';

describe('Basics', () => {
  it('should parse element name', () => {
    expect.assertions(4);
    const att = new AttListDeclaration(
      '<!ATTLIST image height CDATA #REQUIRED>',
    ).parse();
    expect(att.element).toBe('image');
    expect(att.name).toBe('height');
    expect(att.type).toBe(EDtdAttributeType.cdata);
    expect(att.value).toBe('#REQUIRED');
  });
});
