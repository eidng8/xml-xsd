/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */
import { EDtdExternalType } from '../types/dtd/DtdExternalType';
import {
  validatePubIdLiteral,
  validateSystemIdentifier,
} from '../utils/validators';
import { EEntityState } from '../types/dtd/EntityState';
import { InvalidExternalID } from '../exceptions/InvalidExternalID';
import { InvalidUnparsedEntity } from '../exceptions/InvalidUnparsedEntity';
import { IExternalOptions, TFetchFn } from '../types/xml';

export class External {
  private readonly options?;

  private _type?: EDtdExternalType;

  private _name?: string;

  /**
   * URI in the DTD external definition.
   */
  private _uri!: string;

  private _unparsed?: string;

  private _state = EEntityState.unknown;

  get type(): EDtdExternalType | undefined {
    return this._type;
  }

  get state(): EEntityState {
    return this._state;
  }

  get name(): string | undefined {
    return this._name;
  }

  get uri(): string {
    return this._uri;
  }

  get url(): string {
    return this.options && this.options.urlBase
      ? `${this.options.urlBase}${this.uri}`
      : this.uri;
  }

  get fetchFn(): TFetchFn {
    return this.options && this.options.fetchFn;
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
    return undefined === this._unparsed;
  }

  constructor(parts: string[], options?: IExternalOptions) {
    this.options = options;
    if (
      this.options &&
      this.options.urlBase &&
      !this.options.urlBase.endsWith('/')
    ) {
      this.options.urlBase = `${this.options.urlBase}/`;
    }
    const type = parts.shift();
    switch (type) {
      case 'PUBLIC':
        this.parsePublic(parts);
        break;
      case 'SYSTEM':
        this.parsePrivate(parts);
        break;
      default:
        throw new InvalidExternalID(`${type} ${parts.join(' ')}`);
    }
  }

  /**
   * Fetches the remote content. Return empty string if the external has no URI.
   */
  async fetch(): Promise<string> {
    if (!this.fetchFn) {
      throw new Error('Fetcher function has not been set.');
    }
    this._state = EEntityState.fetching;
    return this.fetchFn(this.url).then(res => {
      this._state = EEntityState.ready;
      return res;
    });
  }

  private parsePublic(parts: string[]): void {
    const name = parts.shift()!;
    const uri = parts.shift()!;
    if (!name || !uri) {
      throw new InvalidExternalID(`PUBLIC ${name} ${uri} ${parts.join(' ')}`);
    }
    this._type = EDtdExternalType.public;
    this._name = validatePubIdLiteral(name);
    this._uri = validateSystemIdentifier(uri);
    if (parts.length) this.parseUnparsed(parts);
  }

  private parsePrivate(parts: string[]): void {
    const uri = parts.shift()!;
    if (!uri) {
      throw new InvalidExternalID(`SYSTEM ${uri} ${parts.join(' ')}`);
    }
    this._type = EDtdExternalType.private;
    this._uri = validateSystemIdentifier(uri);
    if (parts.length) this.parseUnparsed(parts);
  }

  private parseUnparsed(declaration: string[]): void {
    if ('NDATA' == declaration[0]) {
      this._unparsed = declaration[1];
      // TODO
      //this._unparsed = validateNotation(declaration[1]);
      return;
    }
    throw new InvalidUnparsedEntity(declaration.join(' '));
  }
}
