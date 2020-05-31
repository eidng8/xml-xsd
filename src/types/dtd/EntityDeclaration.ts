/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityList } from '../dtd/EntityList';

export interface IEntityDeclaration {
  readonly name: string;
  readonly type: 'internal' | 'public' | 'private';

  /**
   * `false` for parameter entity, otherwise `true`.
   */
  readonly general: boolean;
  readonly unparsed?: string;
  readonly value?: string;
  readonly id?: string;
  readonly uri?: string;

  readonly isInternal: boolean;
  readonly isPublic: boolean;
  readonly isPrivate: boolean;
  readonly isExternal: boolean;
  readonly isParsed: boolean;
  readonly isParameter: boolean;

  expand(): IEntityList;
}
