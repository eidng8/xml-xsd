/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from '../types/dtd/EntityDeclaration';
import { IEntityList } from '../types/dtd/EntityList';
import { validateEntityValue, validateName } from '../utils/validators';
import { HasExternal } from '../mixins/HasExternal';
import { EEntityState } from '..';

export default class EntityDeclaration extends HasExternal
  implements IEntityDeclaration {
  /**
   * `false` for parameter entity, otherwise `true`.
   */
  private _general!: boolean;

  get general(): boolean {
    return this._general;
  }

  public get value(): Promise<string | undefined> {
    if (this.isInternal) return Promise.resolve(this._value);
    return super.value;
  }

  get isInternal(): boolean {
    return undefined === this.external;
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

  expand(): IEntityList {
    // TODO
    throw new Error('Method not implemented.');
  }

  public parse(): EntityDeclaration {
    super.parse();
    if ('PUBLIC' == this.parts[0] || 'SYSTEM' == this.parts[0]) {
      this.parseExternal();
    } else {
      this._value = validateEntityValue(this.parts.shift()!);
      this._state = EEntityState.ready;
    }
    return this;
  }

  /**
   * Will mutate `declaration`
   */
  protected parseName(): void {
    const name = this.parts.shift() as string;
    if ('%' != name) {
      this._general = true;
      this._name = validateName(name, this.declaration);
      return;
    }
    this._general = false;
    this._name = validateName(this.parts.shift()!, this.declaration);
  }
}
