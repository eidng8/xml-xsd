/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DeclarationBase } from './DeclarationBase';
import { validateEntityValue } from '..';

export class HasValue extends DeclarationBase {
  protected _value?: string;

  get value(): string | undefined {
    return this._value;
  }

  protected parseValue(): void {
    this._value = validateEntityValue(this.parts.shift()!);
  }
}
