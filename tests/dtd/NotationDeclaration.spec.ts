/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdExternalType, NotationDeclaration, TEXTS } from '../../src';

describe('Declaration', () => {
  it('should accept public external', () => {
    expect.assertions(7);
    const declaration = ['name', 'PUBLIC', '"public_ID"', "'URI'"];
    const ent = new NotationDeclaration(declaration, 'http://example.com/base');
    expect(ent.type).toBe(EDtdExternalType.public);
    expect(ent.name).toBe('name');
    expect(ent.id).toBe('public_ID');
    expect(ent.uri).toBe('URI');
    expect(ent.url).toBe('http://example.com/base/URI');
    expect(ent.isPublic).toBe(true);
    expect(ent.isPrivate).toBe(false);
  });

  it('should accept public external without URI', () => {
    expect.assertions(7);
    const declaration = ['name', 'PUBLIC', '"public_ID"'];
    const ent = new NotationDeclaration(declaration);
    expect(ent.type).toBe(EDtdExternalType.public);
    expect(ent.name).toBe('name');
    expect(ent.id).toBe('public_ID');
    expect(ent.uri).toBeUndefined();
    expect(ent.url).toBeUndefined();
    expect(ent.isPublic).toBe(true);
    expect(ent.isPrivate).toBe(false);
  });

  it('should accept private external', () => {
    expect.assertions(6);
    const declaration = ['name', 'SYSTEM', "'URI'"];
    const ent = new NotationDeclaration(declaration);
    expect(ent.type).toBe(EDtdExternalType.private);
    expect(ent.name).toBe('name');
    expect(ent.uri).toBe('URI');
    expect(ent.id).toBeUndefined();
    expect(ent.isPublic).toBe(false);
    expect(ent.isPrivate).toBe(true);
  });
});

describe('Exceptions', () => {
  it('should throw if not enough composition parts', () => {
    expect.assertions(1);
    expect(() => new NotationDeclaration([])).toThrow(
      TEXTS.errInvalidEntityDeclaration,
    );
  });
});
