import { EDtdElementType, ElementDeclaration } from '../../src';

describe('Basics', () => {
  it('should be `EMPTY`', () => {
    expect.assertions(3);
    const element = new ElementDeclaration('<!ELEMENT img EMPTY>');
    expect(element.name).toBe('img');
    expect(element.type).toBe(EDtdElementType.empty);
    expect(element.content).toBeUndefined();
  });

  it('should be `ANY`', () => {
    expect.assertions(3);
    const element = new ElementDeclaration('<!ELEMENT tag ANY>');
    expect(element.name).toBe('tag');
    expect(element.type).toBe(EDtdElementType.any);
    expect(element.content).toBeUndefined();
  });

  it('should have content', () => {
    expect.assertions(3);
    const element = new ElementDeclaration('<!ELEMENT tag (#PCDATA)>');
    expect(element.name).toBe('tag');
    expect(element.type).toBe(EDtdElementType.mixed);
    expect(element.content).toBe('(#PCDATA)');
  });
});
