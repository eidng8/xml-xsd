/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import EntityDeclaration from '../../src/dtd/EntityDeclaration';

describe('General entity', test(false));

describe('Parameter entity', test(true));

describe('Unparsed entities', () => {
  it('should accept public external', () => {
    expect.assertions(13);
    const declaration = [
      'name',
      'PUBLIC',
      '"public_ID"',
      "'URI'",
      'NDATA',
      'unp_name',
    ];
    const ent = new EntityDeclaration(declaration);
    expect(ent.type).toBe('public');
    expect(ent.name).toBe('name');
    expect(ent.id).toBe('public_ID');
    expect(ent.uri).toBe('URI');
    expect(ent.value).toBeUndefined();
    expect(ent.unparsed).toBe('unp_name');
    expect(ent.general).toBe(true);
    expect(ent.isInternal).toBe(false);
    expect(ent.isPublic).toBe(true);
    expect(ent.isPrivate).toBe(false);
    expect(ent.isExternal).toBe(true);
    expect(ent.isParsed).toBe(false);
    expect(ent.isParameter).toBe(false);
  });

  it('should accept private external', () => {
    expect.assertions(13);
    const declaration = ['name', 'SYSTEM', "'URI'", 'NDATA', 'unp_name'];
    const ent = new EntityDeclaration(declaration);
    expect(ent.type).toBe('private');
    expect(ent.name).toBe('name');
    expect(ent.uri).toBe('URI');
    expect(ent.id).toBeUndefined();
    expect(ent.value).toBeUndefined();
    expect(ent.unparsed).toBe('unp_name');
    expect(ent.general).toBe(true);
    expect(ent.isInternal).toBe(false);
    expect(ent.isPublic).toBe(false);
    expect(ent.isPrivate).toBe(true);
    expect(ent.isExternal).toBe(true);
    expect(ent.isParsed).toBe(false);
    expect(ent.isParameter).toBe(false);
  });
});

function test(parameter) {
  return () => {
    it('should accept internal entity', () => {
      expect.assertions(13);
      const declaration = ['name', '"value"'];
      if (parameter) declaration.unshift('%');
      const ent = new EntityDeclaration(declaration);
      expect(ent.type).toBe('internal');
      expect(ent.name).toBe('name');
      expect(ent.value).toBe('value');
      expect(ent.id).toBeUndefined();
      expect(ent.uri).toBeUndefined();
      expect(ent.unparsed).toBeUndefined();
      expect(ent.general).toBe(!parameter);
      expect(ent.isInternal).toBe(true);
      expect(ent.isPublic).toBe(false);
      expect(ent.isPrivate).toBe(false);
      expect(ent.isExternal).toBe(false);
      expect(ent.isParsed).toBe(true);
      expect(ent.isParameter).toBe(parameter);
    });

    it('should accept public external', () => {
      expect.assertions(13);
      const declaration = ['name', 'PUBLIC', '"public_ID"', "'URI'"];
      if (parameter) declaration.unshift('%');
      const ent = new EntityDeclaration(declaration);
      expect(ent.type).toBe('public');
      expect(ent.name).toBe('name');
      expect(ent.id).toBe('public_ID');
      expect(ent.uri).toBe('URI');
      expect(ent.value).toBeUndefined();
      expect(ent.unparsed).toBeUndefined();
      expect(ent.general).toBe(!parameter);
      expect(ent.isInternal).toBe(false);
      expect(ent.isPublic).toBe(true);
      expect(ent.isPrivate).toBe(false);
      expect(ent.isExternal).toBe(true);
      expect(ent.isParsed).toBe(true);
      expect(ent.isParameter).toBe(parameter);
    });

    it('should accept private external', () => {
      expect.assertions(13);
      const declaration = ['name', 'SYSTEM', "'URI'"];
      if (parameter) declaration.unshift('%');
      const ent = new EntityDeclaration(declaration);
      expect(ent.type).toBe('private');
      expect(ent.name).toBe('name');
      expect(ent.uri).toBe('URI');
      expect(ent.id).toBeUndefined();
      expect(ent.value).toBeUndefined();
      expect(ent.unparsed).toBeUndefined();
      expect(ent.general).toBe(!parameter);
      expect(ent.isInternal).toBe(false);
      expect(ent.isPublic).toBe(false);
      expect(ent.isPrivate).toBe(true);
      expect(ent.isExternal).toBe(true);
      expect(ent.isParsed).toBe(true);
      expect(ent.isParameter).toBe(parameter);
    });
  };
}
