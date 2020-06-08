/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS } from '../translations/en';
import { InvalidEnumerated } from '../exceptions/InvalidEnumerated';
import { DeclarationBase, DeclarationConstructor } from './DeclarationBase';

export function HasEnumerated<
  T extends DeclarationConstructor<DeclarationBase>
>(Base: T) {
  return class extends Base {
    protected _pattern?: string;

    protected _enumValues?: string[];

    get pattern(): string | undefined {
      return this._pattern;
    }

    get enumValues(): string[] | undefined {
      return this._enumValues;
    }

    protected parseEnumerated(): void {
      const type = this.parts.shift()!;
      if ('(' != type[0]) {
        this.throwError(InvalidEnumerated, type, TEXTS.errInvalidEnumerated);
      }
      this._pattern = type.substr(1, type.length - 2);
      this._enumValues = this._pattern.split('|');
    }
  };
}
