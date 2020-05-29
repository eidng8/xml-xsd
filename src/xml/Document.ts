/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { xml2js } from 'xml-js';
import { IDocument, TNode } from '../types/xml';
import DocType from './DocType';
import Declaration from './Declaration';

export default class Document implements IDocument {
  /**
   * From `xml-js`
   */
  declaration!: Declaration;

  doctype?: DocType;

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
    instance.doctype = new DocType(instance);
    const doc = xml2js(xml, {
      addParent: true,
      elementsKey: 'nodes',
      doctypeFn: new DocType(instance).parser(),
    }) as IDocument;
    Object.assign(instance, doc);
    instance.declaration = new Declaration(instance, instance.declaration);
    return instance;
  }

  private constructor(url: string) {
    this.url = url;
    this.urlBase = url.substr(0, url.lastIndexOf('/'));
  }
}
