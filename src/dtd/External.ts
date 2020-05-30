/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */
import axios from 'axios';
import { DtdExternalType } from '../types/dtd';
import { TEXTS } from '../translations/en';
import { parseLiteral } from '../utils/dtd';

export class External {
  _type?: DtdExternalType;

  _name?: string;

  _uri?: string;

  get type(): DtdExternalType | undefined {
    return this._type;
  }

  get name(): string | undefined {
    return this._name;
  }

  get uri(): string | undefined {
    return this._uri;
  }

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
    switch (type) {
      case 'PUBLIC':
        this.parsePublic(nameOrUri, uri!);
        break;
      case 'SYSTEM':
        this.parsePrivate(nameOrUri);
        break;

      default:
        External.throwError(TEXTS.errInvalidExternalID, type, nameOrUri, uri);
    }
  }

  /**
   *
   * @param urlBase No trailing slash.
   */
  async fetch(urlBase?: string): Promise<string> {
    if (!this.uri) return '';
    return axios.get(this.uri, { baseURL: urlBase }).then(res => res.data);
  }

  private parsePublic(name: string, uri: string): void {
    if (!name || !uri) {
      External.throwError(TEXTS.errInvalidExternalID, 'PUBLIC', name, uri);
    }
    this._type = DtdExternalType.public;
    this._name = name;
    this._uri = parseLiteral(uri).trim();
  }

  private parsePrivate(uri: string): void {
    if (!uri) {
      External.throwError(TEXTS.errInvalidExternalID, 'SYSTEM', uri);
    }
    this._type = DtdExternalType.private;
    this._uri = parseLiteral(uri).trim();
  }

  private static throwError(
    msg: string,
    ...args: (string | undefined)[]
  ): void {
    throw new Error(`${msg}: ${args.join(' ')}`);
  }
}
