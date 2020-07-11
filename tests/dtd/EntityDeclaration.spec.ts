/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  EDtdExternalType,
  EEntityState,
  EntityDeclaration,
  InvalidEntityValue,
  InvalidExternalID,
} from '../../src';

describe('General entity', test(false));

describe('Parameter entity', test(true));

describe('Unparsed entities', () => {
  it('should accept public external', async () => {
    expect.assertions(13);
    const declaration =
      '<!ENTITY name PUBLIC "public_ID" \'URI\' NDATA unp_name>';
    const ent = new EntityDeclaration(declaration);
    ent.parse();
    expect(ent.name).toBe('name');
    expect(ent.general).toBe(true);
    expect(ent.isInternal).toBe(false);
    expect(ent.isExternal).toBe(true);
    expect(ent.isParsed).toBe(false);
    expect(ent.isParameter).toBe(false);
    expect(ent.external!.type).toBe(EDtdExternalType.public);
    expect(ent.external!.name).toBe('public_ID');
    expect(ent.external!.uri).toBe('URI');
    expect(ent.external!.unparsed).toBe('unp_name');
    expect(ent.external!.isPublic).toBe(true);
    expect(ent.external!.isPrivate).toBe(false);
    expect(await ent.value).toBeUndefined();
  });

  it('should accept private external', async () => {
    expect.assertions(13);
    const declaration = "<!ENTITY name SYSTEM 'URI' NDATA unp_name>";
    const ent = new EntityDeclaration(declaration);
    ent.parse();
    expect(ent.name).toBe('name');
    expect(ent.general).toBe(true);
    expect(ent.isInternal).toBe(false);
    expect(ent.isExternal).toBe(true);
    expect(ent.isParsed).toBe(false);
    expect(ent.isParameter).toBe(false);
    expect(ent.external!.type).toBe(EDtdExternalType.private);
    expect(ent.external!.uri).toBe('URI');
    expect(ent.external!.name).toBeUndefined();
    expect(ent.external!.unparsed).toBe('unp_name');
    expect(ent.external!.isPublic).toBe(false);
    expect(ent.external!.isPrivate).toBe(true);
    expect(await ent.value).toBeUndefined();
  });
});

describe('Exceptions', () => {
  it('should throw if not enough composition parts', () => {
    expect.assertions(1);
    const ent = new EntityDeclaration('<!ENTITY abc def>');
    expect(() => ent.parse()).toThrow(
      new InvalidEntityValue('def', '<!ENTITY abc def>'),
    );
  });

  it('should throw on invalid unparsed entity', () => {
    expect.assertions(1);
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI" unp_name>';
    const ent = new EntityDeclaration(declaration);
    expect(() => ent.parse()).toThrow(
      new InvalidExternalID(
        'PUBLIC "public_ID" "URI" unp_name',
        '<!ENTITY name PUBLIC "public_ID" "URI" unp_name>',
      ),
    );
  });
});

describe('Value queue', () => {
  it('should resolve all subscribers', async done => {
    expect.assertions(2);
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
    const ent = new EntityDeclaration(declaration, {
      fetchFn: () => {
        Promise.all([ent.value, ent.value]).then(vals => {
          expect(vals).toEqual(['abc', 'abc']);
        });
        return Promise.resolve('abc');
      },
    });
    ent.parse();
    ent.value.then(res => {
      expect(res).toBe('abc');
      done();
    });
  });

  it('should reject all subscriptions', async done => {
    expect.assertions(6);
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
    const ent = new EntityDeclaration(declaration, {
      fetchFn: () => {
        Promise.allSettled([ent.value, ent.value]).then(errs => {
          expect(errs.length).toBe(2);
          expect(errs[0].status).toBe('rejected');
          expect(errs[0]['reason']).toBe('abc');
          expect(errs[1].status).toBe('rejected');
          expect(errs[1]['reason']).toBe('abc');
          done();
        });
        return Promise.reject('abc');
      },
    });
    ent.parse().value.catch(err => {
      expect(err).toEqual('abc');
    });
  });
});

function test(parameter) {
  return () => {
    it('should accept internal entity', async () => {
      expect.assertions(9);
      let declaration = '<!ENTITY name "value">';
      if (parameter) declaration = '<!ENTITY % name "value">';
      const ent = new EntityDeclaration(declaration);
      ent.parse();
      expect(ent.name).toBe('name');
      expect(ent.external).toBeUndefined();
      expect(ent.general).toBe(!parameter);
      expect(ent.isInternal).toBe(true);
      expect(ent.isExternal).toBe(false);
      expect(ent.isParsed).toBe(true);
      expect(ent.isParameter).toBe(parameter);
      expect(ent.state).toBe(EEntityState.ready);
      expect(await ent.value).toBe('value');
    });

    it('should accept public external', async done => {
      expect.assertions(15);
      let declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
      if (parameter) declaration = '<!ENTITY % name PUBLIC "public_ID" "URI">';
      const ent = new EntityDeclaration(declaration, {
        urlBase: 'http://example.com/',
        fetchFn: () => {
          expect(ent.name).toBe('name');
          expect(ent.general).toBe(!parameter);
          expect(ent.isInternal).toBe(false);
          expect(ent.isExternal).toBe(true);
          expect(ent.isParsed).toBe(true);
          expect(ent.isParameter).toBe(parameter);
          expect(ent.state).toBe(EEntityState.fetching);
          expect(ent.type).toBe(EDtdExternalType.public);
          expect(ent.id).toBe('public_ID');
          expect(ent.uri).toBe('URI');
          expect(ent.url).toBe('http://example.com/URI');
          expect(ent.unparsed).toBeUndefined();
          expect(ent.isPublic).toBe(true);
          expect(ent.isPrivate).toBe(false);
          return Promise.resolve('abc');
        },
      });
      ent.parse();
      ent.value.then(val => {
        expect(val).toBe('abc');
        done();
      });
    });

    it('should accept private external', async done => {
      expect.assertions(13);
      let declaration = "<!ENTITY name SYSTEM 'URI'>";
      if (parameter) declaration = "<!ENTITY % name SYSTEM 'URI'>";
      const ent = new EntityDeclaration(declaration, {
        fetchFn: () => {
          expect(ent.name).toBe('name');
          expect(ent.general).toBe(!parameter);
          expect(ent.isInternal).toBe(false);
          expect(ent.isExternal).toBe(true);
          expect(ent.isParsed).toBe(true);
          expect(ent.isParameter).toBe(parameter);
          expect(ent.external!.type).toBe(EDtdExternalType.private);
          expect(ent.external!.uri).toBe('URI');
          expect(ent.external!.name).toBeUndefined();
          expect(ent.external!.unparsed).toBeUndefined();
          expect(ent.external!.isPublic).toBe(false);
          expect(ent.external!.isPrivate).toBe(true);
          return Promise.resolve('abc');
        },
      });
      ent.parse();
      ent.value.then(val => {
        expect(val).toBe('abc');
        done();
      });
    });
  };
}
