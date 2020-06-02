/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */
import axios from 'axios';
import { TEXTS } from '../translations/en';
import { EDtdExternalType } from '../types/dtd/DtdExternalType';
import {
  validatePubIdLiteral,
  validateSystemIdentifier,
} from '../utils/validators';

export class External {
  private _type?: EDtdExternalType;

  private _name?: string;

  private _uri?: string;

  private _unparsed?: string;

  get type(): EDtdExternalType | undefined {
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
      EDtdExternalType.public == this.type &&
      ((this.name as unknown) as boolean) &&
      this.name!.startsWith('ISO')
    );
  }

  /**
   * The DTD is an approved non-ISO standard.
   */
  get isApproved(): boolean {
    return (
      EDtdExternalType.public == this.type &&
      ((this.name as unknown) as boolean) &&
      '+' == this.name![0]
    );
  }

  /**
   * The DTD is an unapproved non-ISO standard.
   */
  get isUnapproved(): boolean {
    return (
      EDtdExternalType.public == this.type &&
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

  get unparsed(): string | undefined {
    return this._unparsed;
  }

  get isPublic(): boolean {
    return EDtdExternalType.public == this.type;
  }

  get isPrivate(): boolean {
    return EDtdExternalType.private == this.type;
  }

  get isParsed(): boolean {
    return !this._unparsed;
  }

  constructor(parts: string[]) {
    const type = parts.shift();
    switch (type) {
      case 'PUBLIC':
        this.parsePublic(parts);
        break;
      case 'SYSTEM':
        this.parsePrivate(parts);
        break;
      default:
        External.throwError(TEXTS.errInvalidExternalID, type, ...parts);
    }
  }

  /**
   * Fetches the remote content. Return empty string if the external has no URI.
   * @param urlBase No trailing slash.
   */
  async fetch(urlBase?: string): Promise<string> {
    if (!this.uri) return Promise.resolve('');
    return axios.get(this.uri, { baseURL: urlBase }).then(res => res.data);
  }

  private parsePublic(parts: string[]): void {
    const name = parts.shift()!;
    const uri = parts.shift()!;
    if (!name || !uri) {
      External.throwError(TEXTS.errInvalidExternalID, 'PUBLIC', name, uri);
    }
    this._type = EDtdExternalType.public;
    this._name = validatePubIdLiteral(name);
    this._uri = validateSystemIdentifier(uri);
    if (parts.length) this.parseUnparsed(parts);
  }

  private parsePrivate(parts: string[]): void {
    const uri = parts.shift()!;
    if (!uri) {
      External.throwError(TEXTS.errInvalidExternalID, 'SYSTEM', uri);
    }
    this._type = EDtdExternalType.private;
    this._uri = validateSystemIdentifier(uri);
    if (parts.length) this.parseUnparsed(parts);
  }

  private parseUnparsed(declaration: string[]): void {
    if (!declaration.length) return;
    if ('NDATA' == declaration[0]) {
      this._unparsed = declaration[1];
      // TODO
      //this._unparsed = validateNotation(declaration[1]);
      return;
    }
    throw new Error(TEXTS.errInvalidUnparsedEntityDeclaration);
  }

  private static throwError(
    msg: string,
    ...args: (string | undefined)[]
  ): void {
    throw new Error(`${msg}: ${args ? args.join(' ') : ''}`);
  }
}
