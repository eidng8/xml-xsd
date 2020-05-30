/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IXmlNodeBase } from '../xml';
import { IEntityDeclaration } from '../dtd';

export interface IDocType extends IXmlNodeBase {
  /**
   * From `xml-js`
   */
  readonly type: 'doctype';

  /**
   * From `xml-js`
   */
  readonly doctype: string;

  parser(): (value: string, parent: object) => IDocType;

  getEntity(name: string): IEntityDeclaration;
}
