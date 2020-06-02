/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EDtdExternalType } from '../types/dtd/DtdExternalType';
import { validatePubIdLiteral } from '../utils/validators';
import { External } from './External';
import { Base } from './Base';

export class NotationDeclaration extends Base {
  readonly external!: External;

  private readonly urlBase: string;

  private readonly _id?: string;

  get id(): string | undefined {
    return this._id || this.external.name;
  }

  get url(): string | undefined {
    return (
      this.external &&
      this.external.uri &&
      this.urlBase &&
      `${this.urlBase}/${this.external.uri}`
    );
  }

  get isPublicId(): boolean {
    return (
      !this.external ||
      (EDtdExternalType.public == this.external!.type && !this.external.uri)
    );
  }

  constructor(declaration: string, urlBase = '') {
    super(declaration);
    this.urlBase = urlBase;
    if (2 == this.parts.length && 'PUBLIC' == this.parts[0]) {
      this._id = validatePubIdLiteral(this.parts[1]);
      return;
    }
    this.external = new External(this.parts);
  }
}
