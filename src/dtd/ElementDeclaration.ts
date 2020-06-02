/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdElementType } from '../types/dtd/DtdElementType';
import { TEXTS } from '../translations/en';
import { Base } from './Base';

export class ElementDeclaration extends Base {
  private _type!: EDtdElementType;

  private _content?: string;

  get type(): EDtdElementType {
    return this._type;
  }

  get content(): string | undefined {
    return this._content;
  }

  constructor(declaration: string) {
    super(declaration);
    this.parseContent();
  }

  private parseContent(): void {
    const content = this.parts.shift()!;
    if ('(' == content[0]) this.parseMixed(content);
    else if ('EMPTY' == content) this._type = EDtdElementType.empty;
    else if ('ANY' == content) this._type = EDtdElementType.any;
    else throw new Error(TEXTS.errInvalidDeclaration);
  }

  private parseMixed(content: string): void {
    this._type = EDtdElementType.mixed;
    this._content = content;
  }
}
