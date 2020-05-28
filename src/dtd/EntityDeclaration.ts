/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd';
import { TEXTS } from '../translations/en';

export default class EntityDeclaration implements IEntityDeclaration {
  readonly name: string;

  readonly type: 'internal' | 'public' | 'private';

  readonly unparsed?: string;

  readonly id?: string;

  readonly uri?: string;

  readonly value?: string;

  constructor(declaration: string[]) {
    if (!declaration || declaration.length < 2) {
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    this.name = declaration.shift()!;
    const value = declaration.shift()!;
    switch (value) {
      case 'PUBLIC':
        this.type = 'public';
        this.id = declaration[0];
        this.uri = declaration[1];
        this.unparsed = declaration[3];
        break;

      case 'SYSTEM':
        this.type = 'private';
        this.uri = declaration[0];
        this.unparsed = declaration[2];
        break;

      default:
        this.type = 'internal';
        this.value = value.substr(1, value.length - 2).trim();
    }
    this.validate();
  }

  private validate() {
    if (this.uri) this.validateUri();
  }

  private validateUri() {
    if (this.uri!.indexOf('#') >= 0) throw new Error(TEXTS.errInvalidUri);
  }
}
