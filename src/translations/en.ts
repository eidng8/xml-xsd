/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { reduce } from 'lodash';

export const TEXTS = {
  errInvalidDocument: 'Invalid document',
  errInvalidDocType: 'Invalid DOCTYPE',
  errInvalidDeclaration: 'Invalid declaration',
  errInvalidName: 'Invalid name `%s` in `%s`.',
  errInvalidSystemLiteral: 'Invalid SystemLiteral',
  errInvalidSystemIdentifier: 'Invalid system identifier',
  errInvalidPubIdLiteral: 'Invalid PubidLiteral',
  errInvalidUri: 'Invalid URI',
  errInvalidEntity: 'Invalid entity',
  errInvalidEntityValue: 'Invalid entity value',
  errInvalidEntityDeclaration: 'Invalid entity declaration.',
  errInvalidUnparsedEntityDeclaration: 'Invalid unparsed entity declaration.',
  errInvalidExternalID: 'Invalid external ID',
  errInvalidIntSubset: 'Invalid internal subset',
};

export function format(template: string, params: string[]): string {
  return reduce(params, (prev, param) => prev.replace('%s', param), template);
}
