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
  errInvalidEnumerated: 'Invalid enumerated `%s` in `%s`.',
  errInvalidSystemLiteral: 'Invalid system literal `%s` in `%s`.',
  errInvalidSystemIdentifier: 'Invalid system identifier `%s` in `%s`.',
  errInvalidPubIdLiteral: 'Invalid Pubid literal `%s` in `%s`.',
  errInvalidUri: 'Invalid URI',
  errInvalidEntity: 'Invalid entity',
  errInvalidEntityValue: 'Invalid entity value `%s` in `%s`.',
  errInvalidUnparsedEntityDeclaration: 'Invalid unparsed entity declaration.',
  errInvalidExternalID: 'Invalid external ID',
  errInvalidIntSubset: 'Invalid internal subset',
};

export function format(template: string, params: string[]): string {
  return reduce(params, (prev, param) => prev.replace('%s', param), template);
}
