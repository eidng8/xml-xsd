/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdElementType, ElementDeclaration } from '../../src';

describe('Basics', () => {
  it('should be `EMPTY`', () => {
    expect.assertions(4);
    const element = new ElementDeclaration('<!ELEMENT img EMPTY>');
    element.parse();
    expect(element.name).toBe('img');
    expect(element.type).toBe(EDtdElementType.empty);
    expect(element.pattern).toBeUndefined();
    expect(element.enumValues).toBeUndefined();
  });

  it('should be `ANY`', () => {
    expect.assertions(4);
    const element = new ElementDeclaration('<!ELEMENT tag ANY>');
    element.parse();
    expect(element.name).toBe('tag');
    expect(element.type).toBe(EDtdElementType.any);
    expect(element.pattern).toBeUndefined();
    expect(element.enumValues).toBeUndefined();
  });

  it('should have enumerated content', () => {
    expect.assertions(4);
    const element = new ElementDeclaration('<!ELEMENT tag (child5|child6)>');
    element.parse();
    expect(element.name).toBe('tag');
    expect(element.type).toBe(EDtdElementType.mixed);
    expect(element.pattern).toBe('child5|child6');
    expect(element.enumValues).toEqual(['child5', 'child6']);
  });

  it.skip('should have mixed content', () => {
    expect.assertions(4);
    const element = new ElementDeclaration(
      '<!ELEMENT tag (#PCDATA,child1,child2?,child3*,child4+,(child5|child6))*>',
    );
    element.parse();
    expect(element.name).toBe('tag');
    expect(element.type).toBe(EDtdElementType.mixed);
    expect(element.pattern).toBe('#PCDATA');
    expect(element.enumValues).toEqual(['#PCDATA']);
  });
});
