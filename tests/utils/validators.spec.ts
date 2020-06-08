/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  InvalidName,
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
    expect(validateName('abc', '')).toBe('abc');
    expect(validateName('abc-def', '')).toBe('abc-def');
    expect(validateName('abc_def', '')).toBe('abc_def');
    expect(validateName('abc.def', '')).toBe('abc.def');
    expect(validateName(':abc_def', '')).toBe(':abc_def');
    expect(validateName('_abc', '')).toBe('_abc');
    expect(validateName('工', '')).toBe('工');
    expect(validateName('あ', '')).toBe('あ');
  });

  it('should throw on invalid start char', () => {
    expect.assertions(3);
    expect(() => validateName('-abc', 'cde')).toThrow(
      new InvalidName('-abc', 'cde'),
    );
    expect(() => validateName('.abc', 'cde')).toThrow(
      new InvalidName('.abc', 'cde'),
    );
    expect(() => validateName('2abc', 'cde')).toThrow(
      new InvalidName('2abc', 'cde'),
    );
  });

  it('should throw on invalid char', () => {
    expect.assertions(5);
    expect(() => validateName('a&bc', 'cde')).toThrow(
      new InvalidName('a&bc', 'cde'),
    );
    expect(() => validateName('a"bc', 'cde')).toThrow(
      new InvalidName('a"bc', 'cde'),
    );
    expect(() => validateName("a'bc", 'cde')).toThrow(
      new InvalidName("a'bc", 'cde'),
    );
    expect(() => validateName('a\tbc', 'cde')).toThrow(
      new InvalidName('a\tbc', 'cde'),
    );
    expect(() => validateName('a bc', 'cde')).toThrow(
      new InvalidName('a bc', 'cde'),
    );
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

describe('System literal', () => {
  it('should return valid literal', () => {
    expect.assertions(4);
    expect(validateSystemLiteral("' abc'")).toBe('abc');
    expect(validateSystemLiteral('" abc"')).toBe('abc');
    expect(validateSystemLiteral("'ab\"c'")).toBe('ab"c');
    expect(validateSystemLiteral('"ab\'c"')).toBe("ab'c");
  });

  it('should throw on invalid char', () => {
    expect.assertions(2);
    expect(() => validateSystemLiteral("'ab'c'")).toThrow(
      TEXTS.errInvalidSystemLiteral,
    );
    expect(() => validateSystemLiteral('"ab"c"')).toThrow(
      TEXTS.errInvalidSystemLiteral,
    );
  });
});

describe('System identifier', () => {
  it('should return valid identifier', () => {
    expect.assertions(4);
    expect(validateSystemIdentifier("'abc'")).toBe('abc');
    expect(validateSystemIdentifier('" abc"')).toBe('abc');
    expect(validateSystemIdentifier("' ab\"c'")).toBe('ab"c');
    expect(validateSystemIdentifier('"ab\'c"')).toBe("ab'c");
  });

  it('should throw on invalid char', () => {
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

describe('Pubid literal', () => {
  it('should return valid Pubid', () => {
    expect.assertions(3);
    expect(validatePubIdLiteral('"abc"')).toBe('abc');
    expect(validatePubIdLiteral("'abc'")).toBe('abc');
    expect(
      validatePubIdLiteral("'-//W3C//DTD HTML 4.0 Transitional//EN'"),
    ).toBe('-//W3C//DTD HTML 4.0 Transitional//EN');
  });

  it('should throw on invalid char', () => {
    expect.assertions(2);
    expect(() => validatePubIdLiteral("'工'")).toThrow(
      TEXTS.errInvalidPubIdLiteral,
    );
    expect(() => validatePubIdLiteral('"あ"')).toThrow(
      TEXTS.errInvalidPubIdLiteral,
    );
  });
});
