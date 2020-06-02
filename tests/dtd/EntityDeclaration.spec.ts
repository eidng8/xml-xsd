/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import moxios = require('moxios');
import {
  EDtdExternalType,
  EEntityState,
  EntityDeclaration,
  TEXTS,
} from '../../src';

describe('General entity', test(false));

describe('Parameter entity', test(true));

describe('Unparsed entities', () => {
  it('should accept public external', async () => {
    expect.assertions(13);
    const declaration =
      '<!ENTITY name PUBLIC "public_ID" \'URI\' NDATA unp_name>';
    const ent = new EntityDeclaration(declaration);
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
    expect(await ent.value).toBe('URI');
  });

  it('should accept private external', async () => {
    expect.assertions(13);
    const declaration = "<!ENTITY name SYSTEM 'URI' NDATA unp_name>";
    const ent = new EntityDeclaration(declaration);
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
    expect(await ent.value).toBe('URI');
  });
});

describe('Exceptions', () => {
  it('should throw if not enough composition parts', () => {
    expect.assertions(1);
    expect(() => new EntityDeclaration('')).toThrow(
      TEXTS.errInvalidDeclaration,
    );
  });

  it('should throw on invalid unparsed entity', () => {
    expect.assertions(1);
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI" unp_name>';
    expect(() => new EntityDeclaration(declaration)).toThrow(
      TEXTS.errInvalidUnparsedEntityDeclaration,
    );
  });
});

describe('Value queue', () => {
  beforeEach(() => moxios.install());

  afterEach(() => moxios.uninstall());

  it('should resolve all subscribers', async done => {
    expect.assertions(2);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      Promise.all([ent.value, ent.value]).then(vals => {
        expect(vals).toEqual(['abc', 'abc']);
      });
      request.respondWith({ response: 'abc' }).then(async () => {
        expect(await ent.value).toBe('abc');
        done();
      });
    });
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
    const ent = new EntityDeclaration(declaration);
  });

  it('should reject all subscribers', async done => {
    expect.assertions(3);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      Promise.allSettled([ent.value, ent.value]).then(errs => {
        expect(errs.length).toBe(2);
        expect(errs[0].status).toBe('rejected');
        expect(errs[1].status).toBe('rejected');
      });
      request.respondWith({ status: 404, response: 'abc' }).then(() => {
        ent.value.then(() => fail('Should be rejected')).catch(() => done());
      });
    });
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
    const ent = new EntityDeclaration(declaration);
  });
});

function test(parameter) {
  return () => {
    it('should accept internal entity', async () => {
      expect.assertions(9);
      let declaration = '<!ENTITY name "value">';
      if (parameter) declaration = '<!ENTITY % name "value">';
      const ent = new EntityDeclaration(declaration);
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
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ response: 'abc' }).then(async () => {
          expect(ent.name).toBe('name');
          expect(ent.external!.type).toBe(EDtdExternalType.public);
          expect(ent.general).toBe(!parameter);
          expect(ent.isInternal).toBe(false);
          expect(ent.isExternal).toBe(true);
          expect(ent.isParsed).toBe(true);
          expect(ent.isParameter).toBe(parameter);
          expect(ent.state).toBe(EEntityState.ready);
          expect(ent.external!.name).toBe('public_ID');
          expect(ent.external!.uri).toBe('URI');
          expect(ent.external!.unparsed).toBeUndefined();
          expect(ent.external!.isPublic).toBe(true);
          expect(ent.external!.isPrivate).toBe(false);
          expect(await ent.value).toBe('abc');
          moxios.uninstall();
          done();
        });
      });
      let declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
      if (parameter) declaration = '<!ENTITY % name PUBLIC "public_ID" "URI">';
      const ent = new EntityDeclaration(declaration);
      expect(ent.state).toBe(EEntityState.fetching);
    });

    it('should accept private external', async done => {
      expect.assertions(13);
      moxios.install();
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ response: 'abc' }).then(async () => {
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
          expect(await ent.value).toBe('abc');
          moxios.uninstall();
          done();
        });
      });
      let declaration = "<!ENTITY name SYSTEM 'URI'>";
      if (parameter) declaration = "<!ENTITY % name SYSTEM 'URI'>";
      const ent = new EntityDeclaration(declaration);
    });
  };
}
