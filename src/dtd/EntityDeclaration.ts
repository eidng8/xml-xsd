/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd';
import { TEXTS } from '../translations/en';
import {
  validateEntityValue,
  validateName,
  validatePubIdLiteral,
  validateSystemIdentifier,
} from '../utils/validators';

export default class EntityDeclaration implements IEntityDeclaration {
  readonly name: string;

  readonly type: 'internal' | 'public' | 'private';

  readonly unparsed?: string;

  readonly id?: string;

  readonly uri?: string;

  readonly value?: string;

  get isInternal(): boolean {
    return 'internal' == this.type;
  }

  get isPublic(): boolean {
    return 'public' == this.type;
  }

  get isPrivate(): boolean {
    return 'private' == this.type;
  }

  get isUnparsed(): boolean {
    return !this.unparsed;
  }

  constructor(declaration: string[]) {
    if (!declaration || declaration.length < 2) {
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    this.name = validateName(declaration.shift()!);
    const value = declaration.shift()!;
    switch (value) {
      case 'PUBLIC':
        this.type = 'public';
        this.id = validatePubIdLiteral(declaration[0]);
        this.uri = validateSystemIdentifier(declaration[1]);
        this.unparsed = validateName(declaration[3]);
        break;

      case 'SYSTEM':
        this.type = 'private';
        this.uri = validateSystemIdentifier(declaration[0]);
        this.unparsed = validateName(declaration[2]);
        break;

      default:
        this.type = 'internal';
        this.value = validateEntityValue(value);
    }
  }
}
