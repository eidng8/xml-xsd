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
  declaration!: Declaration;

  doctype?: DocType;

  nodes?: TNode[];

  static load(xml: string): Document {
    const instance = new Document();
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

  private constructor() {}
}
