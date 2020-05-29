/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { xml2js } from 'xml-js';
import { IDocType, IDocument, TNode } from '../types/xml';
import DocType from './DocType';
import Declaration from './Declaration';
import { TEXTS } from '..';

export default class Document implements IDocument {
  /**
   * From `xml-js`
   */
  declaration!: Declaration;

  doctype?: IDocType;

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
    let c = '';
    let nest = 0;
    start += 10;
    for (let i = start; i < xml.length; i++) {
      c = xml[i];
      if ('<' == c) nest++;
      else if ('>' == c) {
        if (0 == nest) {
          return new DocType(xml.substring(start, i));
        }
        nest--;
      }
    }
    throw new Error(TEXTS.errInvalidDocType);
  }

  private constructor(url: string) {
    this.url = url;
    this.urlBase = url.substr(0, url.lastIndexOf('/'));
  }
}
