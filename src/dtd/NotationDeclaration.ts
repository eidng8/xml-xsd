/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS } from '../translations/en';
import { validateName } from '../utils/validators';
import { External } from './External';
import { EDtdExternalType } from '../types/dtd/DtdExternalType';

export class NotationDeclaration {
  private readonly urlBase: string;

  private readonly declaration: string;

  private _name!: string;

  private external!: External;

  get name(): string {
    return this._name;
  }

  get type(): EDtdExternalType {
    return this.external.type!;
  }

  get id(): string | undefined {
    return this.external.name;
  }

  get uri(): string | undefined {
    return this.external.uri;
  }

  get url(): string | undefined {
    return this.urlBase && this.external.uri
      ? `${this.urlBase}/${this.external.uri}`
      : this.external.uri;
  }

  get isPublic(): boolean {
    return !!this.external && EDtdExternalType.public == this.external!.type;
  }

  get isPrivate(): boolean {
    return !!this.external && EDtdExternalType.private == this.external!.type;
  }

  constructor(declaration: string[], urlBase = '') {
    this.declaration = `<${declaration.join(' ')}>`;
    if (!declaration || declaration.length < 2) {
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    try {
      this.urlBase = urlBase;
      this.parseName(declaration);
      this.parseValue(declaration);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Will mutate `declaration`
   * @param declaration
   */
  private parseName(declaration: string[]): void {
    const name = declaration.shift()!;
    this._name = validateName(name, this.declaration);
  }

  /**
   * Will mutate `declaration`
   * @param declaration
   */
  private parseValue(declaration: string[]): void {
    switch (declaration[0]) {
      case 'PUBLIC':
      case 'SYSTEM':
        this.parseExternal(declaration);
        break;
      default:
        throw new Error(TEXTS.errInvalidDeclaration);
    }
  }

  private parseExternal(declaration: string[]): void {
    this.external = new External(declaration);
  }
}
