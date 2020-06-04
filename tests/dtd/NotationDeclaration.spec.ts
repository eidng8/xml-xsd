/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdExternalType, NotationDeclaration, TEXTS } from '../../src';

describe('Declaration', () => {
  it('should accept public ID', () => {
    expect.assertions(4);
    const declaration = '<!NOTATION name PUBLIC "public_ID">';
    const ent = new NotationDeclaration(declaration).parse();
    expect(ent.isPublicId).toBe(true);
    expect(ent.name).toBe('name');
    expect(ent.id).toBe('public_ID');
    expect(ent.url).toBeUndefined();
  });

  it('should accept public external', () => {
    expect.assertions(8);
    const declaration = '<!NOTATION name PUBLIC\t"public_ID" \'URI\'>';
    const ent = new NotationDeclaration(declaration, 'http://example.com/base');
    ent.parse();
    expect(ent.isPublicId).toBe(false);
    expect(ent.external!.type).toBe(EDtdExternalType.public);
    expect(ent.name).toBe('name');
    expect(ent.id).toBe('public_ID');
    expect(ent.external!.uri).toBe('URI');
    expect(ent.url).toBe('http://example.com/base/URI');
    expect(ent.external!.isPublic).toBe(true);
    expect(ent.external!.isPrivate).toBe(false);
  });

  it('should accept private external', () => {
    expect.assertions(7);
    const declaration = '<!NOTATION name SYSTEM "URI">';
    const ent = new NotationDeclaration(declaration);
    ent.parse();
    expect(ent.isPublicId).toBe(false);
    expect(ent.external!.type).toBe(EDtdExternalType.private);
    expect(ent.name).toBe('name');
    expect(ent.external!.uri).toBe('URI');
    expect(ent.id).toBeUndefined();
    expect(ent.external!.isPublic).toBe(false);
    expect(ent.external!.isPrivate).toBe(true);
  });
});

describe('Exceptions', () => {
  it('should throw if not enough composition parts', () => {
    expect.assertions(1);
    expect(() => new NotationDeclaration('').parse()).toThrow(
      TEXTS.errInvalidDeclaration,
    );
  });
});
