/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export const enum DtdExternalType {
  public = 1,
  private,
}

export interface IEntityDeclaration {
  name: string;
  type: 'internal' | 'public' | 'private';
  unparsed?: string;
  value?: string;
  id?: string;
  uri?: string;
}
