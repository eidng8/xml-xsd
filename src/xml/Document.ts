/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { xml2js } from 'xml-js';
import { TNode } from '../types/xml';
import { IDocType } from '../types/xml/doctype';
import { IDocument } from '../types/xml/document';
import DocType from './DocType';
import Declaration from './Declaration';
import { extractBlock } from '../utils/markup';

export default class Document implements IDocument {
  /**
   * From `xml-js`
   */
  declaration!: Declaration;

  doctype!: IDocType;

  readonly url: string;

  /**
   * No trailing slash
   */
  readonly urlBase: string;

  /**
   * From `xml-js`
   */
  nodes?: TNode[];

  static load(xml: string, url = ''): Document {
    const instance = new Document(url);
    instance.doctype = Document.parseDocType(xml);
    const doc = xml2js(xml, {
      addParent: true,
      elementsKey: 'nodes',
      doctypeFn: instance.doctype.parser(),
    }) as IDocument;
    Object.assign(instance, doc);
    instance.declaration = new Declaration(instance, instance.declaration);
    return instance;
  }

  private static parseDocType(xml: string): IDocType {
    let start = xml.indexOf('<!DOCTYPE ');
    if (-1 == start) return new DocType();
    return new DocType(extractBlock(xml, start)[0]);
  }

  private constructor(url: string) {
    this.url = url;
    this.urlBase = url.substr(0, url.lastIndexOf('/'));
  }
}
