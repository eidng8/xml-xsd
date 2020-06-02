/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd/EntityDeclaration';
import { IEntityList } from '../types/dtd/EntityList';
import { EEntityState } from '../types/dtd/EntityState';
import { validateEntityValue, validateName } from '../utils/validators';
import { External } from './External';
import { Base } from './Base';

export default class EntityDeclaration extends Base
  implements IEntityDeclaration {
  private _external?: External;
  private readonly urlBase: string;

  /**
   * `false` for parameter entity, otherwise `true`.
   */
  private _general!: boolean;

  private _state = EEntityState.unknown;

  private _value?: string;

  private subscribers = [] as [Function, Function][];

  private lastError?: Error;

  get general(): boolean {
    return this._general;
  }

  get state(): EEntityState {
    return this._state;
  }

  get value(): Promise<string> {
    if (EEntityState.ready == this.state) {
      return new Promise<string>(resolve => resolve(this._value));
    }
    if (EEntityState.error == this.state) {
      return new Promise<string>((_, reject) => reject(this.lastError));
    }
    return new Promise<string>((resolve, reject) =>
      this.subscribers.push([resolve, reject]),
    );
  }

  get isInternal(): boolean {
    return undefined === this._external;
  }

  get isExternal(): boolean {
    return this._external !== undefined;
  }

  get isParsed(): boolean {
    return this.isInternal || this._external!.isParsed;
  }

  get isParameter(): boolean {
    return !this._general;
  }

  get external(): External | undefined {
    return this._external;
  }

  constructor(declaration: string, urlBase = '') {
    super(declaration);
    try {
      this.urlBase = urlBase;
      this.parseValue();
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
   */
  protected parseName(): string {
    const name = this.parts.shift()!;
    if ('%' == name) {
      this._general = false;
      return validateName(this.parts.shift()!, this.declaration);
    }
    this._general = true;
    return validateName(name, this.declaration);
  }

  /**
   * Will mutate `declaration`
   */
  private parseValue(): void {
    switch (this.parts[0]) {
      case 'PUBLIC':
      case 'SYSTEM':
        this.parseExternal();
        break;
      default:
        this.parseInternal(this.parts[0]);
    }
  }

  private parseInternal(value: string): void {
    this._value = validateEntityValue(value);
    this._state = EEntityState.ready;
  }

  private parseExternal(): void {
    this._external = new External(this.parts);
    if (this._external.isParsed) {
      this._state = EEntityState.fetching;
      this._external
        .fetch(this.urlBase)
        .then(res => {
          this._state = EEntityState.parsing;
          this._value = res;
          this._state = EEntityState.ready;
          this.resolveSubscribers();
        })
        .catch(err => {
          this._state = EEntityState.error;
          this.lastError = err;
          this._value = '';
          this.rejectSubscribers(err);
        });
    } else {
      this._value = this._external.uri;
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
