/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IDocument } from './xml/document';
import { IDocType } from './xml/doctype';

export interface IAttribute {
  [key: string]: string | undefined;
}

export interface IDeclaration {
  attributes?: {
    encoding?: string;
    version?: '1.0' | '1.1';
    standalone?: 'yes' | 'no';
  };
  readonly parent: IDocument;
}

export interface IXmlNodeBase {
  /**
   * From `xml-js`
   */
  type: string;

  /**
   * From `xml-js`
   */
  readonly parent?: IElement | IDocument;
}

export interface ICData extends IXmlNodeBase {
  type: 'cdata';
  cdata: string;
}

export interface IComment extends IXmlNodeBase {
  type: 'comment';
  comment: string;
}

export interface IElement extends IXmlNodeBase {
  type: 'element';
  name: string;
  attributes?: IAttribute;
  nodes?: TNode[];
}

export interface IInstruction extends IXmlNodeBase {
  type: 'instruction';
  name: string;
  instruction?: string;
  attributes?: IAttribute;
}

export interface IText extends IXmlNodeBase {
  type: 'text';
  text: string;
}

export type TNode =
  | ICData
  | IComment
  | IDocType
  | IElement
  | IInstruction
  | IText;

// export type TNodeTypes =
//   | 'cdata'
//   | 'comment'
//   | 'doctype'
//   | 'element'
//   | 'instruction'
//   | 'text';

export type TFetchFn = (url: string) => Promise<string>;

export interface IExternalOptions {
  urlBase?: string;
  fetchFn?: TFetchFn;
}
