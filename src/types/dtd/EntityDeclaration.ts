/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { EEntityState } from './EntityState';
import { External } from '../../dtd/External';

export interface IEntityDeclaration {
  readonly name: string;
  readonly state: EEntityState;
  readonly external?: External;

  /**
   * `false` for parameter entity, otherwise `true`.
   */
  readonly general: boolean;
  readonly value: Promise<string | undefined>;

  readonly isInternal: boolean;
  readonly isExternal: boolean;
  readonly isParsed: boolean;
  readonly isParameter: boolean;
}
