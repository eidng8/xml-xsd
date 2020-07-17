/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdAttributeType } from '../types/dtd/DtdAttributeType';
import { DeclarationBase } from '../mixins/DeclarationBase';
import { HasEnumerated } from '../mixins/HasEnumerated';
import { HasValue } from '../mixins/HasValue';
import { DeclarationException } from '..';

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

export interface IAttributeDeclaration {
  name: string;
  type: EDtdAttributeType;
  required: boolean;
  fixed: boolean;
  enumerable?: string[];
  /**
   * default value of the attribute
   */
  value?: string;
}

export class AttListDeclaration extends HasEnumerated(
  HasValue(DeclarationBase),
) {
  private _element!: string;

  private _type!: EDtdAttributeType;

  private _required: boolean = false;

  private _fixed: boolean = false;

  private _list: IAttributeDeclaration[] = [];

  get element(): string {
    return this._element;
  }

  get list(): IAttributeDeclaration[] {
    return this._list;
  }

  parse(): AttListDeclaration {
    super.parse();
    this._element = this.name;
    while (this.parts.length) {
      this.parseName();
      this.parseType();
      this.parseDefault();
      this._list.push({
        name: this._name,
        type: this._type,
        enumerable: this.enumValues,
        required: this._required,
        fixed: this._fixed,
        value: this.value,
      });
      this.reset();
    }
    return this;
  }

  private reset(): void {
    this._required = this._fixed = false;
    this._enumValues = this._value = undefined;
    this._name = (undefined as unknown) as string;
    this._type = (undefined as unknown) as EDtdAttributeType;
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
      // @ts-ignore TS-7029 fall through
      case '#REQUIRED':
        this._required = true;
      case '#IMPLIED':
        this.parts.shift();
        return;
      // @ts-ignore TS-7029 fall through
      case '#FIXED':
        this._fixed = true;
        this.parts.shift();
      default:
        this.parseValue();
        this.validateDefaultValue();
    }
  }

  private validateDefaultValue(): void {
    if (EDtdAttributeType.enumerated == this._type) {
      if (-1 == this.enumValues!.indexOf(this.value!)) {
        this.throwError(
          DeclarationException,
          this.declaration,
          `Invalid value "${this.value}"`,
        );
      }
    }
  }
}
