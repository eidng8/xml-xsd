/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdAttributeType } from '../types/dtd/DtdAttributeType';
import { TEXTS } from '../translations/en';
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

export class AttListDeclaration extends HasValue {
  private _element!: string;

  private _type!: EDtdAttributeType;

  private _pattern?: string;

  private _enumValues?: string[];

  private _required: boolean = false;

  get type(): EDtdAttributeType {
    return this._type;
  }

  get element(): string {
    return this._element;
  }

  get pattern(): string | undefined {
    return this._pattern;
  }

  get enumValues(): string[] | undefined {
    return this._enumValues;
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
    const type = this.parts.shift()!;
    this._type = TYPES[type];
    if (EDtdAttributeType.notation == this._type) this.parseNotations();
    else if (!this._type) this.parseEnumerated(type);
  }

  private parseEnumerated(type: string): void {
    if ('(' != type[0]) throw new Error(TEXTS.errInvalidDeclaration);
    this._pattern = type.substr(1, type.length - 2);
    this._enumValues = this._pattern.split('|');
    this._type = EDtdAttributeType.enumerated;
  }

  private parseNotations(): void {
    const values = this.parts.shift()!;
    this._enumValues = values.substr(1, values.length - 2).split('|');
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
