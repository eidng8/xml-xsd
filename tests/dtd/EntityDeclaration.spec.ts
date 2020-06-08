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
    const ent = new EntityDeclaration(declaration, 'http://example.com/base');
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
    const ent = new EntityDeclaration(declaration, 'http://example.com/base');
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
    const ent = new EntityDeclaration('<!ENTITY abc def>', 'base');
    expect(() => ent.parse()).toThrow(new InvalidEntityValue('abc', 'def'));
  });

  it('should throw on invalid unparsed entity', () => {
    expect.assertions(1);
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI" unp_name>';
    const ent = new EntityDeclaration(declaration, 'http://example.com/base');
    expect(() => ent.parse()).toThrow(
      new InvalidExternalID(
        'PUBLIC "public_ID" "URI" unp_name',
        '<!ENTITY name PUBLIC "public_ID" "URI" unp_name>',
      ),
    );
  });
});

describe('Value queue', () => {
  beforeEach(() => moxios.install());

  afterEach(() => moxios.uninstall());

  it('should resolve all subscribers', async done => {
    expect.assertions(3);
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
    const ent = new EntityDeclaration(declaration, 'http://example.com/base');
    ent.parse();
    ent.value.then(res => expect(res).toBe('abc'));
  });

  it('should reject all subscribers', async done => {
    expect.assertions(7);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      Promise.allSettled([ent.value, ent.value]).then(errs => {
        expect(errs.length).toBe(2);
        expect(errs[0].status).toBe('rejected');
        expect(errs[0]['reason']['response']['data']).toBe('abc');
        expect(errs[1].status).toBe('rejected');
        expect(errs[1]['reason']['response']['data']).toBe('abc');
        done();
      });
      request.respondWith({ status: 404, response: 'abc' });
    });
    const declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
    const ent = new EntityDeclaration(declaration, 'http://example.com/base');
    ent.parse().value.catch(err => {
      expect(err.response.status).toBe(404);
      expect(err.response.data).toEqual('abc');
    });
  });
});

function test(parameter) {
  return () => {
    it('should accept internal entity', async () => {
      expect.assertions(9);
      let declaration = '<!ENTITY name "value">';
      if (parameter) declaration = '<!ENTITY % name "value">';
      const ent = new EntityDeclaration(declaration, 'http://example.com/base');
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
      moxios.install();
      moxios.wait(() => {
        expect(ent.state).toBe(EEntityState.fetching);
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
          moxios.uninstall();
          done();
        });
      });
      let declaration = '<!ENTITY name PUBLIC "public_ID" "URI">';
      if (parameter) declaration = '<!ENTITY % name PUBLIC "public_ID" "URI">';
      const ent = new EntityDeclaration(declaration, 'http://example.com/base');
      ent.parse();
      ent.value.then(val => expect(val).toBe('abc'));
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
          moxios.uninstall();
          done();
        });
      });
      let declaration = "<!ENTITY name SYSTEM 'URI'>";
      if (parameter) declaration = "<!ENTITY % name SYSTEM 'URI'>";
      const ent = new EntityDeclaration(declaration, 'http://example.com/base');
      ent.parse();
      ent.value.then(val => expect(val).toBe('abc'));
    });
  };
}
