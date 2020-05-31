/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd/EntityDeclaration';
import { IEntityList } from '../types/dtd/EntityList';
import { TEXTS } from '../translations/en';
import {
  validateEntityValue,
  validateName,
  validatePubIdLiteral,
  validateSystemIdentifier,
} from '../utils/validators';

export default class EntityDeclaration implements IEntityDeclaration {
  readonly name: string;

  /**
   * `false` for parameter entity, otherwise `true`.
   */
  readonly general: boolean;

  private _type!: 'internal' | 'public' | 'private';

  private _unparsed?: string;

  private _id?: string;

  private _uri?: string;

  private _value?: string;

  public get type(): 'internal' | 'public' | 'private' {
    return this._type;
  }

  public get unparsed(): string | undefined {
    return this._unparsed;
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get uri(): string | undefined {
    return this._uri;
  }

  public get value(): string | undefined {
    return this._value;
  }

  get isInternal(): boolean {
    return 'internal' == this._type;
  }

  get isPublic(): boolean {
    return 'public' == this._type;
  }

  get isPrivate(): boolean {
    return 'private' == this._type;
  }

  get isExternal(): boolean {
    return this.isPublic || this.isPrivate;
  }

  get isParsed(): boolean {
    return !this._unparsed;
  }

  get isParameter(): boolean {
    return !this.general;
  }

  constructor(declaration: string[]) {
    if (!declaration || declaration.length < 2) {
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    const name = declaration.shift()!;
    if ('%' == name) {
      this.general = false;
      this.name = validateName(declaration.shift()!);
    } else {
      this.general = true;
      this.name = validateName(name);
    }
    const value = declaration.shift()!;
    switch (value) {
      case 'PUBLIC':
        this.parsePublic(declaration);
        break;

      case 'SYSTEM':
        this.parsePrivate(declaration);
        break;

      default:
        this.parseInternal(value);
    }
  }

  expand(): IEntityList {
    // TODO
    throw new Error('Method not implemented.');
  }

  private parsePublic(declaration: string[]): void {
    this._type = 'public';
    this._id = validatePubIdLiteral(declaration[0]);
    this._uri = validateSystemIdentifier(declaration[1]);
    this.parseUnparsed(declaration.slice(2));
  }

  private parsePrivate(declaration: string[]): void {
    this._type = 'private';
    this._uri = validateSystemIdentifier(declaration[0]);
    this.parseUnparsed(declaration.slice(1));
  }

  private parseInternal(value: string): void {
    this._type = 'internal';
    this._value = validateEntityValue(value);
  }

  private parseUnparsed(declaration: string[]): void {
    if (!declaration.length) return;
    if ('NDATA' == declaration[0]) {
      this._unparsed = validateName(declaration[1]);
      return;
    }
    throw new Error(TEXTS.errInvalidUnparsedEntityDeclaration);
  }
}
