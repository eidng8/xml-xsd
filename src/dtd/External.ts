/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DtdExternalType } from '../types/dtd';

export default class External {
  readonly type?: DtdExternalType;

  readonly name?: string;

  readonly uri?: string;

  /**
   * The DTD is an ISO standard. All ISO standards are approved.
   */
  get isISO(): boolean {
    return (
      DtdExternalType.public == this.type &&
      ((this.name as unknown) as boolean) &&
      this.name!.startsWith('ISO')
    );
  }

  /**
   * The DTD is an approved non-ISO standard.
   */
  get isApproved(): boolean {
    return (
      DtdExternalType.public == this.type &&
      ((this.name as unknown) as boolean) &&
      '+' == this.name![0]
    );
  }

  /**
   * The DTD is an unapproved non-ISO standard.
   */
  get isUnapproved(): boolean {
    return (
      DtdExternalType.public == this.type &&
      ((this.name as unknown) as boolean) &&
      '-' == this.name![0]
    );
  }

  /**
   * Owner of the DTD.
   */
  get owner(): string | undefined {
    if (!this.name) return undefined;
    return this.name.split('//', 2)[1];
  }

  /**
   * Description of the DTD.
   */
  get description(): string | undefined {
    if (!this.name) return undefined;
    return this.name.split('//', 3)[2];
  }

  /**
   * ISO 639 language identifier.
   */
  get language(): string | undefined {
    if (!this.name) return undefined;
    return this.name.split('//', 4)[3];
  }

  /**
   *
   * @param type
   * @param nameOrUri This is the URI to "Private" (SYSTEM) external DTDs,
   * or ID of "Public" (PUBLIC) external DTDs.
   * @param uri
   */
  constructor(type: 'PUBLIC' | 'SYSTEM', nameOrUri: string, uri?: string) {
    if (!type) return;
    if ('PUBLIC' == type) {
      this.type = DtdExternalType.public;
      this.name = nameOrUri;
      this.uri = uri;
    } else {
      this.type = DtdExternalType.private;
      this.uri = nameOrUri;
    }
  }
}
