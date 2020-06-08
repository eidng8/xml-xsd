/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import moxios from 'moxios';
import {
  EDtdExternalType,
  EEntityState,
  External,
  InvalidExternalID,
} from '../../src';

describe('External DTD', () => {
  it('handles private DTD', () => {
    expect.assertions(9);
    const dtd = new External(['SYSTEM', '"external.dtd"']);
    expect(dtd.type).toBe(EDtdExternalType.private);
    expect(dtd.name).toBeUndefined();
    expect(dtd.uri).toBe('external.dtd');
    expect(dtd.owner).toBeUndefined();
    expect(dtd.description).toBeUndefined();
    expect(dtd.language).toBeUndefined();
    expect(dtd.isISO).toBe(false);
    expect(dtd.isApproved).toBe(false);
    expect(dtd.isUnapproved).toBe(false);
  });

  it('handles public DTD', () => {
    expect.assertions(9);
    const dtd = new External(['PUBLIC', '"name"', "'external.dtd'"]);
    expect(dtd.type).toBe(EDtdExternalType.public);
    expect(dtd.name).toBe('name');
    expect(dtd.uri).toBe('external.dtd');
    expect(dtd.owner).toBeUndefined();
    expect(dtd.description).toBeUndefined();
    expect(dtd.language).toBeUndefined();
    expect(dtd.isISO).toBe(false);
    expect(dtd.isApproved).toBe(false);
    expect(dtd.isUnapproved).toBe(false);
  });

  it('checks ISO standard', () => {
    expect.assertions(4);
    const dtd = new External(['PUBLIC', '"ISO//name"', '"external.dtd"']);
    expect(dtd.name).toBe('ISO//name');
    expect(dtd.isISO).toBe(true);
    expect(dtd.isApproved).toBe(false);
    expect(dtd.isUnapproved).toBe(false);
  });

  it('checks approved standard', () => {
    expect.assertions(4);
    const dtd = new External(['PUBLIC', '"+//name"', '"external.dtd"']);
    expect(dtd.name).toBe('+//name');
    expect(dtd.isISO).toBe(false);
    expect(dtd.isApproved).toBe(true);
    expect(dtd.isUnapproved).toBe(false);
  });

  it('checks standard types', () => {
    expect.assertions(4);
    const dtd = new External(['PUBLIC', '"-//name"', '"external.dtd"']);
    expect(dtd.name).toBe('-//name');
    expect(dtd.isISO).toBe(false);
    expect(dtd.isApproved).toBe(false);
    expect(dtd.isUnapproved).toBe(true);
  });

  it('returns details of DTD', () => {
    expect.assertions(4);
    const dtd = new External([
      'PUBLIC',
      '"-//W3C//DTD HTML 4.0 Transitional//EN"',
      '"external.dtd"',
    ]);
    expect(dtd.name).toBe('-//W3C//DTD HTML 4.0 Transitional//EN');
    expect(dtd.owner).toBe('W3C');
    expect(dtd.description).toBe('DTD HTML 4.0 Transitional');
    expect(dtd.language).toBe('EN');
  });

  it('fetches remote content', done => {
    expect.assertions(5);
    moxios.install();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).toBe('external.dtd');
      expect(request.config.baseURL).toBe('http://example.com/base');
      request.respondWith({ response: 'abc' }).then(res => {
        expect(res.data).toBe('abc');
        expect(external.state).toBe(EEntityState.ready);
        moxios.uninstall();
        done();
      });
    });
    const external = new External([
      'PUBLIC',
      '"-//W3C//DTD HTML 4.0 Transitional//EN"',
      '"external.dtd"',
    ]);
    external.fetch('http://example.com/base');
    expect(external.state).toBe(EEntityState.fetching);
  });
});

describe('Errors', () => {
  it('should throw on invalid type', () => {
    expect.assertions(1);
    expect(() => new External(['abc'])).toThrow(new InvalidExternalID('abc '));
  });

  it('should throw if name is missing', () => {
    expect.assertions(2);
    expect(() => new External(['PUBLIC'])).toThrow(
      new InvalidExternalID('PUBLIC   '),
    );
    expect(() => new External(['PUBLIC', '', 'abc'])).toThrow(
      new InvalidExternalID('PUBLIC  abc '),
    );
  });

  it('should throw if URI is missing', () => {
    expect.assertions(2);
    expect(() => new External(['PUBLIC', 'abc'])).toThrow(
      new InvalidExternalID('PUBLIC abc  '),
    );
    expect(() => new External(['SYSTEM'])).toThrow(
      new InvalidExternalID('SYSTEM   '),
    );
  });
});
