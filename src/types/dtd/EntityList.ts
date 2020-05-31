/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IEntityDeclaration } from './EntityDeclaration';

export interface IEntityList {
  [key: string]: IEntityDeclaration;
}
