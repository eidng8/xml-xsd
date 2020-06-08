/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdElementType } from '../types/dtd/DtdElementType';
import { TEXTS } from '../translations/en';
import { DeclarationBase } from '../mixins/DeclarationBase';
import { HasEnumerated } from '../mixins/HasEnumerated';
import { InvalidElement } from '../exceptions/InvalidElement';

export class ElementDeclaration extends HasEnumerated(DeclarationBase) {
  private _type!: EDtdElementType;

  get type(): EDtdElementType {
    return this._type;
  }

  parse(): ElementDeclaration {
    super.parse();
    this.parseContent();
    return this;
  }

  private parseContent(): void {
    const content = this.parts[0];
    if ('EMPTY' == content) this._type = EDtdElementType.empty;
    else if ('ANY' == content) this._type = EDtdElementType.any;
    else if ('(' == content[0]) {
      this.parseEnumerated();
      this._type = EDtdElementType.mixed;
      return;
    } else {
      this.throwError(InvalidElement, content, TEXTS.errInvalidDeclaration);
    }
    this.parts.shift();
  }
}
