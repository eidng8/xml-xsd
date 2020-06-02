import { AttListDeclaration } from '../../src';

describe('Basics', () => {
  it('should parse element name', () => {
    expect.assertions(3);
    const att = new AttListDeclaration(
      '<!ATTLIST image height CDATA #REQUIRED>',
    );
    expect(att.element).toBe('image');
    expect(att.name).toBe('height');
    expect(att.content).toEqual(['CDATA', '#REQUIRED']);
  });
});
