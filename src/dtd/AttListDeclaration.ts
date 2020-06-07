/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdAttributeType } from '../types/dtd/DtdAttributeType';
import { DeclarationBase } from '../mixins/DeclarationBase';
import { HasEnumerated } from '../mixins/HasEnumerated';
import { HasValue } from '../mixins/HasValue';

const TYPES = {
  CDATA: EDtdAttributeType.cdata,
  NOTATION: EDtdAttributeType.notation,
  ID: EDtdAttributeType.id,
  IDREF: EDtdAttributeType.idref,
  IDREFS: EDtdAttributeType.idrefs,
  ENTITY: EDtdAttributeType.entity,
  ENTITIES: EDtdAttributeType.entities,
  NMTOKEN: EDtdAttributeType.nmtoken,
  NMTOKENS: EDtdAttributeType.nmtokens,
};

export class AttListDeclaration extends HasEnumerated(
  HasValue(DeclarationBase),
) {
  private _element!: string;

  private _type!: EDtdAttributeType;

  private _required: boolean = false;

  get type(): EDtdAttributeType {
    return this._type;
  }

  get element(): string {
    return this._element;
  }

  get isRequired(): boolean {
    return this._required;
  }

  parse(): AttListDeclaration {
    super.parse();
    this._element = this.name;
    this.parseName();
    this.parseType();
    this.parseDefault();
    return this;
  }

  private parseType(): void {
    this._type = TYPES[this.parts[0]];
    if (EDtdAttributeType.notation == this._type) {
      this.parts.shift();
      this.parseEnumerated();
    } else if (!this._type) {
      this.parseEnumerated();
      this._type = EDtdAttributeType.enumerated;
    } else {
      this.parts.shift();
    }
  }

  private parseDefault(): void {
    const def = this.parts[0]!;
    // noinspection FallThroughInSwitchStatementJS
    switch (def) {
      // @ts-ignore
      case '#REQUIRED':
        this._required = true;
      case '#IMPLIED':
        this.parts.shift();
        return;
      case '#FIXED':
        this.parts.shift();
        this.parseValue();
        break;
      default:
        this.parseValue();
    }
  }
}
