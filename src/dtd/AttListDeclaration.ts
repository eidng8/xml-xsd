/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Base } from './Base';

export class AttListDeclaration extends Base {
  readonly element: string;

  get content(): string[] {
    return this.parts;
  }

  constructor(declaration: string) {
    super(declaration);
    this.element = this.name;
    this._name = this.parseName();
  }
}
