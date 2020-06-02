/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Base } from './Base';
import { EDtdAttributeType } from '../types/dtd/DtdAttributeType';
import { TEXTS } from '..';

export class AttListDeclaration extends Base {
  readonly element: string;

  readonly type: EDtdAttributeType;

  readonly value?: string;

  constructor(declaration: string) {
    super(declaration);
    this.element = this.name;
    this._name = this.parseName();
    this.type = this.parseType();
    this.value = this.parts.shift();
  }

  private parseType(): EDtdAttributeType {
    const type = this.parts.shift()!;
    switch (type) {
      case 'CDATA':
        return EDtdAttributeType.cdata;
      case 'NOTATION':
        return EDtdAttributeType.notation;
      case 'ID':
        return EDtdAttributeType.id;
      case 'IDREF':
        return EDtdAttributeType.idref;
      case 'IDREFS':
        return EDtdAttributeType.idrefs;
      case 'ENTITY':
        return EDtdAttributeType.entity;
      case 'ENTITIES':
        return EDtdAttributeType.entities;
      case 'NMTOKEN':
        return EDtdAttributeType.nmtoken;
      case 'NMTOKENS':
        return EDtdAttributeType.nmtokens;
      default:
        if ('(' == type[0]) return EDtdAttributeType.enumerated;
        else throw new Error(TEXTS.errInvalidDeclaration);
    }
  }
}
