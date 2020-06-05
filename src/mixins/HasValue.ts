/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { validateEntityValue } from '../utils/validators';
import { DeclarationBase, DeclarationConstructor } from './DeclarationBase';

export function HasValue<T extends DeclarationConstructor<DeclarationBase>>(
  Base: T,
) {
  return class extends Base {
    protected _value?: string;

    get value(): string | undefined {
      return this._value;
    }

    protected parseValue(): void {
      this._value = validateEntityValue(this.parts.shift()!);
    }
  };
}
