/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EEntityState } from '../types/dtd/EntityState';
import { External } from '../dtd/External';
import { validatePubIdLiteral } from '../utils/validators';
import { DeclarationBase, DeclarationConstructor } from './DeclarationBase';
import { InvalidExternalID } from '../exceptions/InvalidExternalID';
import { IExternalOptions } from '../types/xml';
import { EDtdExternalType } from '../types/dtd/DtdExternalType';

export function HasExternal<T extends DeclarationConstructor<DeclarationBase>>(
  Base: T,
) {
  return class extends Base {
    protected options?: IExternalOptions;

    protected _state = EEntityState.unknown;

    protected _id?: string;

    protected _value?: string;

    protected _external?: External;

    protected _lastError?: Error;

    protected _subscribers = [] as [Function, Function][];

    get state(): EEntityState {
      return this._state;
    }

    get id(): string | undefined {
      return this._id || (this.external && this.external!.name);
    }

    get external(): External | undefined {
      return this._external;
    }

    get type(): EDtdExternalType | undefined {
      return this.external && this.external.type;
    }

    get uri(): string | undefined {
      return this.external && this.external.uri;
    }

    get url(): string | undefined {
      return this.external && this.external.url;
    }

    get isPublic(): boolean {
      return this.external ? this.external.isPublic : false;
    }

    get isPrivate(): boolean {
      return this.external ? this.external.isPrivate : false;
    }

    get unparsed(): string | undefined {
      return this.external && this.external.unparsed;
    }

    /**
     * Whether the external is only a public ID, which is only a name string.
     */
    get isPublicId(): boolean {
      return !this.external;
    }

    get value(): Promise<string | undefined> {
      if (this.isPublicId) return Promise.resolve(undefined);
      switch (this.state) {
        case EEntityState.ready:
          return Promise.resolve(this._value);
        case EEntityState.error:
          return Promise.reject(this._lastError);
        default:
          return this.queue();
      }
    }

    constructor(...args: any[]) {
      super(args[0]);
      this.options = args[1];
    }

    protected parseExternal(): void {
      if (2 == this.parts.length && 'PUBLIC' == this.parts[0]) {
        this.parts.shift();
        this._id = validatePubIdLiteral(this.parts.shift()!, this.declaration);
      }
      if (undefined === this._id) {
        const input = this.parts.join(' ');
        try {
          this._external = new External(this.parts, this.options);
        } catch (e) {
          this.throwError(InvalidExternalID, input);
        }
      }
    }

    protected async queue(): Promise<string | undefined> {
      if (!this.external!.isParsed) {
        this._state = EEntityState.ready;
        return Promise.resolve(undefined);
      }
      this.fetch();
      return new Promise<string>((resolve, reject) =>
        this._subscribers.push([resolve, reject]),
      );
    }

    protected fetch(): void {
      if (this._state != EEntityState.unknown) return;
      this._state = EEntityState.fetching;
      this.external!.fetch()
        .then(res => {
          this._value = res;
          this._state = EEntityState.ready;
          this.resolveSubscribers();
        })
        .catch(err => {
          this._state = EEntityState.error;
          this._lastError = err;
          this.rejectSubscribers(err);
        });
    }

    protected resolveSubscribers(): void {
      while (this._subscribers.length) {
        (this._subscribers.shift() as Function[])[0](this._value);
      }
    }

    protected rejectSubscribers(err: Error) {
      while (this._subscribers.length) {
        (this._subscribers.shift() as Function[])[1](err);
      }
    }
  };
}
