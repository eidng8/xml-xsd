/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DeclarationException } from './DeclarationException';
import { TEXTS } from '../translations/en';

export class InvalidIntSubset extends DeclarationException {
  constructor(input: string, context?: string, message?: string) {
    super(input, context, message || TEXTS.errInvalidIntSubset);
  }
}
