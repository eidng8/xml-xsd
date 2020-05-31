/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd/EntityDeclaration';
import { IEntityList } from '../types/dtd/EntityList';
import { TEXTS } from '../translations/en';
import { validateEntityValue, validateName } from '../utils/validators';
import { EEntityState } from '../types/dtd/EntityState';
import { External } from './External';
import { EDtdExternalType } from '..';
import { rapid } from '../utils/timer';

export default class EntityDeclaration implements IEntityDeclaration {
  private readonly urlBase: string;

  private _name!: string;

  /**
   * `false` for parameter entity, otherwise `true`.
   */
  private _general!: boolean;

  private _state = EEntityState.unknown;

  private _value?: string;

  private external?: External;

  private subscribers = [] as [Function, Function][];

  get name(): string {
    return this._name;
  }

  get general(): boolean {
    return this._general;
  }
  get type(): EDtdExternalType {
    return (this.external && this.external.type) || EDtdExternalType.internal;
  }

  get state(): EEntityState {
    return this._state;
  }

  get unparsed(): string | undefined {
    return this.external && this.external.unparsed;
  }

  get id(): string | undefined {
    return this.external && this.external.name;
  }

  get uri(): string | undefined {
    return this.external && this.external.uri;
  }

  get value(): Promise<string> {
    if (EEntityState.ready == this.state) {
      return new Promise<string>(resolve => rapid(() => resolve(this._value)));
    }
    if (EEntityState.error == this.state) {
      return new Promise<string>((_, reject) => rapid(() => reject()));
    }
    return new Promise<string>((resolve, reject) =>
      rapid(() => this.subscribers.push([resolve, reject])),
    );
  }

  get isInternal(): boolean {
    return undefined === this.external;
  }

  get isPublic(): boolean {
    return !!this.external && EDtdExternalType.public == this.external!.type;
  }

  get isPrivate(): boolean {
    return !!this.external && EDtdExternalType.private == this.external!.type;
  }

  get isExternal(): boolean {
    return this.external !== undefined;
  }

  get isParsed(): boolean {
    return this.isInternal || this.external!.isParsed;
  }

  get isParameter(): boolean {
    return !this._general;
  }

  constructor(declaration: string[], urlBase = '') {
    if (!declaration || declaration.length < 2) {
      this._state = EEntityState.error;
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    try {
      this.urlBase = urlBase;
      this.parseName(declaration);
      this.parseValue(declaration);
    } catch (e) {
      this._state = EEntityState.error;
      throw e;
    }
  }

  expand(): IEntityList {
    // TODO
    throw new Error('Method not implemented.');
  }

  /**
   * Will mutate `declaration`
   * @param declaration
   */
  private parseName(declaration: string[]): void {
    const name = declaration.shift()!;
    if ('%' == name) {
      this._general = false;
      this._name = validateName(declaration.shift()!);
    } else {
      this._general = true;
      this._name = validateName(name);
    }
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
        this.parseInternal(declaration[0]);
    }
  }

  private parseInternal(value: string): void {
    this._value = validateEntityValue(value);
    this._state = EEntityState.ready;
  }

  private parseExternal(declaration: string[]): void {
    this.external = new External(declaration);
    if (this.external.isParsed) {
      this._state = EEntityState.fetching;
      this.external
        .fetch(this.urlBase)
        .then(res => {
          this._state = EEntityState.parsing;
          this._value = res;
          this._state = EEntityState.ready;
          this.resolveSubscribers();
        })
        .catch(err => {
          this._state = EEntityState.error;
          this._value = '';
          this.rejectSubscribers(err);
        });
    } else {
      this._value = this.external.uri;
      this._state = EEntityState.ready;
    }
  }

  private resolveSubscribers(): void {
    while (this.subscribers.length) {
      (this.subscribers.shift() as Function[])[0](this._value);
    }
  }

  private rejectSubscribers(err: Error) {
    while (this.subscribers.length) {
      (this.subscribers.shift() as Function[])[1](err);
    }
  }
}
