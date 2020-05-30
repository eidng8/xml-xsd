/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IDeclaration, TNode } from '../xml';
import { IDocType } from './doctype';

export interface IDocument {
  /**
   * From `xml-js`
   */
  declaration?: IDeclaration;

  /**
   * From `xml-js`
   */
  doctype?: IDocType;

  /**
   * From `xml-js`
   */
  nodes?: TNode[];

  readonly url: string;

  readonly urlBase: string;
}
