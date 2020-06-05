/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS } from '../translations/en';
import { validateName } from '../utils/validators';
import { decompose } from '../utils/markup';

export class DeclarationBase implements IDeclarationBase {
  readonly declaration: string;

  protected parts!: string[];

  protected _name!: string;

  get name(): string {
    return this._name;
  }

  parse(): DeclarationBase {
    this.parts = this.decompose();
    if (!this.parts || this.parts.length < 2) {
      throw new Error(TEXTS.errInvalidDeclaration);
    }
    this.parseName();
    return this;
  }

  constructor(declaration: string) {
    this.declaration = declaration;
  }

  protected decompose(): string[] {
    return decompose(this.declaration).slice(1);
  }

  /**
   * Will mutate `declaration`
   */
  protected parseName(): void {
    this._name = validateName(this.parts.shift()!, this.declaration);
  }
}

export interface IDeclarationBase {
  readonly declaration: string;

  readonly name: string;

  parse(): IDeclarationBase;
}

export type DeclarationConstructor<T extends IDeclarationBase> = new (
  ...args: any[]
) => T;
