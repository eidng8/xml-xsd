/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdExternalType, External, TEXTS } from '../../src';

describe('External DTD', () => {
  it('handles private DTD', () => {
    expect.assertions(6);
    const dtd = new External(['SYSTEM', '"external.dtd"']);
    expect(dtd.type).toBe(EDtdExternalType.private);
    expect(dtd.name).toBeUndefined();
    expect(dtd.uri).toBe('external.dtd');
    expect(dtd.isISO).toBe(false);
    expect(dtd.isApproved).toBe(false);
    expect(dtd.isUnapproved).toBe(false);
  });

  it('handles public DTD', () => {
    expect.assertions(6);
    const dtd = new External(['PUBLIC', '"name"', "'external.dtd'"]);
    expect(dtd.type).toBe(EDtdExternalType.public);
    expect(dtd.name).toBe('name');
    expect(dtd.uri).toBe('external.dtd');
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
});

describe('Errors', function () {
  it('should throw on invalid type', function () {
    expect.assertions(1);
    expect(() => new External(['abc'])).toThrow(TEXTS.errInvalidExternalID);
  });

  it('should throw if name is missing', function () {
    expect.assertions(2);
    expect(() => new External(['PUBLIC'])).toThrow(TEXTS.errInvalidExternalID);
    expect(() => new External(['PUBLIC', '', 'abc'])).toThrow(
      TEXTS.errInvalidExternalID,
    );
  });

  it('should throw if URI is missing', function () {
    expect.assertions(2);
    expect(() => new External(['PUBLIC', 'abc'])).toThrow(
      TEXTS.errInvalidExternalID,
    );
    expect(() => new External(['SYSTEM'])).toThrow(TEXTS.errInvalidExternalID);
  });
});
