/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS, validateEntityValue, validateName } from '../../src';

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
    expect.assertions(1);
    expect(validateEntityValue('"abc"')).toBe('"abc"');
  });
});
