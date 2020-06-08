/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import XRegExp from 'xregexp';
import { InvalidEntityValue } from '../exceptions/InvalidEntityValue';
import { InvalidSystemIdentifier } from '../exceptions/InvalidSystemIdentifier';
import { InvalidSystemLiteral } from '../exceptions/InvalidSystemLiteral';
import { InvalidPubIdLiteral } from '../exceptions/InvalidPubIdLiteral';
import { InvalidName } from '../exceptions/InvalidName';

const pubIdChar = '()+,./:=?;!*#@$_%a-zA-Z0-9 \\n\\r-';

/**
 * https://www.w3.org/TR/REC-xml/#NT-NameStartChar
 *
 * Although the specification includes `[#x10000-#xEFFFF]` range, `sax.js`
 * does *not*. That range seems to cover `[0-9]` which is erroneous.
 */
const nameStartChars =
  ':_a-zA-Z\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';

const nameStartChar = `[${nameStartChars}]`;

const nameChar = `[-.\\d${nameStartChars}\\xB7\\u0300-\\u036F\\u203F-\\u2040]`;

const name = `${nameStartChar}${nameChar}*`;

const peRef = `%${name};`;

const entityRef = `&${name};`;

const charRef = '&#(?=\\d+;)[^&;]+;|&#x(?=[\\da-fA-F]+;)[^&;]+;';

/**
 * https://www.w3.org/TR/REC-xml/#NT-Name
 * @param str
 * @param context
 */
export function validateName(str: string, context?: string): string {
  if (XRegExp(`^${name}$`).test(str)) return str;
  throw new InvalidName(str, context);
}

/**
 * https://www.w3.org/TR/REC-xml/#NT-PubidLiteral
 */
export function validatePubIdLiteral(str: string, context?: string): string {
  const regex = XRegExp(`^"['${pubIdChar}]*"$|^'["${pubIdChar}]*'$`);
  if (regex.test(str)) return str.substr(1, str.length - 2).trim();
  throw new InvalidPubIdLiteral(str, context);
}

/**
 * https://www.w3.org/TR/REC-xml/#NT-SystemLiteral
 */
export function validateSystemLiteral(str: string, context?: string): string {
  if (/^'[^']*'$|^"[^"]*"$/.test(str))
    return str.substr(1, str.length - 2).trim();
  throw new InvalidSystemLiteral(str, context);
}

/**
 * https://www.w3.org/TR/REC-xml/#NT-ExternalID
 */
export function validateSystemIdentifier(
  str: string,
  context?: string,
): string {
  if (/^'[^'#]*'$|^"[^"#]*"$/.test(str))
    return str.substr(1, str.length - 2).trim();
  throw new InvalidSystemIdentifier(str, context);
}

/**
 * https://www.w3.org/TR/REC-xml/#NT-EntityValue
 */
export function validateEntityValue(str: string, context?: string): string {
  const refs = `${peRef}|${entityRef}|${charRef}`;
  const regex = XRegExp(`^"([^%&"]|${refs})*"$|^'([^%&']|${refs})*'$`);
  if (regex.test(str)) return str.substr(1, str.length - 2).trim();
  throw new InvalidEntityValue(str, context);
}
