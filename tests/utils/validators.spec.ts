/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  TEXTS,
  validateEntityValue,
  validateName,
  validatePubIdLiteral,
  validateSystemIdentifier,
  validateSystemLiteral,
} from '../../src';

describe('Name', () => {
  it('should return valid name', () => {
    expect.assertions(8);
    expect(validateName('abc')).toBe('abc');
    expect(validateName('abc-def')).toBe('abc-def');
    expect(validateName('abc_def')).toBe('abc_def');
    expect(validateName('abc.def')).toBe('abc.def');
    expect(validateName(':abc_def')).toBe(':abc_def');
    expect(validateName('_abc')).toBe('_abc');
    expect(validateName('工')).toBe('工');
    expect(validateName('あ')).toBe('あ');
  });

  it('should throw on invalid start char', () => {
    expect.assertions(3);
    expect(() => validateName('-abc')).toThrow(TEXTS.errInvalidName);
    expect(() => validateName('.abc')).toThrow(TEXTS.errInvalidName);
    expect(() => validateName('2abc')).toThrow(TEXTS.errInvalidName);
  });

  it('should throw on invalid char', () => {
    expect.assertions(5);
    expect(() => validateName('a&bc')).toThrow(TEXTS.errInvalidName);
    expect(() => validateName('a"bc')).toThrow(TEXTS.errInvalidName);
    expect(() => validateName("a'bc")).toThrow(TEXTS.errInvalidName);
    expect(() => validateName('a\tbc')).toThrow(TEXTS.errInvalidName);
    expect(() => validateName('a bc')).toThrow(TEXTS.errInvalidName);
  });
});

describe('Entity value', () => {
  it('should return valid value', () => {
    expect.assertions(9);
    expect(validateEntityValue('" abc"')).toBe('abc');
    expect(validateEntityValue('"a-bc"')).toBe('a-bc');
    expect(validateEntityValue('"a_bc"')).toBe('a_bc');
    expect(validateEntityValue('"a.bc"')).toBe('a.bc');
    expect(validateEntityValue('" _a.bc"')).toBe('_a.bc');
    expect(validateEntityValue('":a\'bc"')).toBe(":a'bc");
    expect(validateEntityValue("'-a.\"bc'")).toBe('-a."bc');
    expect(validateEntityValue('"工"')).toBe('工');
    expect(validateEntityValue('"あ"')).toBe('あ');
  });

  it('should throw on invalid char', () => {
    expect.assertions(4);
    expect(() => validateEntityValue('"a&bc"')).toThrow(
      TEXTS.errInvalidEntityValue,
    );
    expect(() => validateEntityValue('"a%bc"')).toThrow(
      TEXTS.errInvalidEntityValue,
    );
    expect(() => validateEntityValue('"ab"c"')).toThrow(
      TEXTS.errInvalidEntityValue,
    );
    expect(() => validateEntityValue("'ab'c'")).toThrow(
      TEXTS.errInvalidEntityValue,
    );
  });
});

describe('System literal', function () {
  it('should return valid literal', function () {
    expect.assertions(4);
    expect(validateSystemLiteral("' abc'")).toBe('abc');
    expect(validateSystemLiteral('" abc"')).toBe('abc');
    expect(validateSystemLiteral("'ab\"c'")).toBe('ab"c');
    expect(validateSystemLiteral('"ab\'c"')).toBe("ab'c");
  });

  it('should throw on invalid char', function () {
    expect.assertions(2);
    expect(() => validateSystemLiteral("'ab'c'")).toThrow(
      TEXTS.errInvalidSystemLiteral,
    );
    expect(() => validateSystemLiteral('"ab"c"')).toThrow(
      TEXTS.errInvalidSystemLiteral,
    );
  });
});

describe('System identifier', function () {
  it('should return valid identifier', function () {
    expect.assertions(4);
    expect(validateSystemIdentifier("'abc'")).toBe('abc');
    expect(validateSystemIdentifier('" abc"')).toBe('abc');
    expect(validateSystemIdentifier("' ab\"c'")).toBe('ab"c');
    expect(validateSystemIdentifier('"ab\'c"')).toBe("ab'c");
  });

  it('should throw on invalid char', function () {
    expect.assertions(3);
    expect(() => validateSystemIdentifier("'ab'c'")).toThrow(
      TEXTS.errInvalidSystemIdentifier,
    );
    expect(() => validateSystemIdentifier('"ab"c"')).toThrow(
      TEXTS.errInvalidSystemIdentifier,
    );
    expect(() => validateSystemIdentifier('"ab#c"')).toThrow(
      TEXTS.errInvalidSystemIdentifier,
    );
  });
});

describe('Pubid literal', function () {
  it('should return valid Pubid', function () {
    expect.assertions(3);
    expect(validatePubIdLiteral('"abc"')).toBe('abc');
    expect(validatePubIdLiteral("'abc'")).toBe('abc');
    expect(
      validatePubIdLiteral("'-//W3C//DTD HTML 4.0 Transitional//EN'"),
    ).toBe('-//W3C//DTD HTML 4.0 Transitional//EN');
  });

  it('should throw on invalid char', function () {
    expect.assertions(2);
    expect(() => validatePubIdLiteral("'工'")).toThrow(
      TEXTS.errInvalidPubIdLiteral,
    );
    expect(() => validatePubIdLiteral('"あ"')).toThrow(
      TEXTS.errInvalidPubIdLiteral,
    );
  });
});
