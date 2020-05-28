/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SAXParser } from 'sax';
import { IDocType, IDocument } from '../types/xml';
import External from '../dtd/External';
import Document from './Document';
import EntityDeclaration from '../dtd/EntityDeclaration';

export default class DocType implements IDocType {
  readonly type = 'doctype' as 'doctype';

  dtd = { entities: {} } as any;

  /**
   * Parameter entities
   */
  variables = [];

  private _doctype!: string;

  private readonly _parent: Document;

  get parent(): Document {
    return this._parent;
  }

  get doctype(): string {
    return this._doctype;
  }

  constructor(doc: Document) {
    this._parent = doc;
  }

  getEntity(name: string): string {
    return this.dtd.entities[name];
  }

  parser(): (value: string, parent: IDocument) => DocType {
    const self = this;
    return function (this: SAXParser, value: string): DocType {
      self._doctype = value;
      const bp = value.indexOf('[');
      if (bp < 0) {
        self.parseRoot(value);
      } else {
        self.parseRoot(value.substring(0, bp));
        self.parseInternal(value.substr(bp), this);
      }
      return self;
    };
  }

  /**
   * - Internal DTD:
   * ```text
   * <!DOCTYPE root_element [
   *  elements|attributes|entities|notations|
   *  processing instructions|comments|PE references
   * ]>
   * ```
   * - "Private" External DTDs
   * ```text
   * <!DOCTYPE root_element SYSTEM "DTD_location">
   * ```
   * - "Public" External DTDs
   * ```text
   * <!DOCTYPE root_element PUBLIC "DTD_name" "DTD_location">
   * ```
   *
   * @param dtd
   */
  parseRoot(dtd: string): void {
    let match: RegExpExecArray | null;
    const buf = ([] as unknown) as ['PUBLIC' | 'SYSTEM', string, string];
    const reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?/g;
    while ((match = reg.exec(dtd))) buf.push(match[0]);
    if (!buf.length) throw new Error('Invalid DOCTYPE');
    this.dtd.root = buf.shift();
    this.dtd.external = new External(...buf);
  }

  parseInternal(dtd: string, parser: SAXParser): void {
    let match: RegExpExecArray | null;
    const regex = /^\s*<([^<]+)>\s*$/gm;
    while ((match = regex.exec(dtd))) this.parseMarkup(match[1], parser);
  }

  parseMarkup(dec: string, parser: SAXParser): void {
    let matches = [] as string[];
    let match: RegExpExecArray | null;
    const regex = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?/g;
    while ((match = regex.exec(dec))) matches.push(match[0]);
    if (!matches.length) return;
    switch (matches.shift()) {
      case '!ENTITY':
        this.parseEntity(parser, matches);
        break;
    }
  }

  /**
   * Processes the given entity declaration and add it to `parser`'s `ENTITIES`
   * list.
   *
   * - Internal (parsed) general entity declaration
   * ```text
   * <!ENTITY name "entity_value">
   * ```
   * - external (parsed) general "Private" entity declaration
   * ```text
   * <!ENTITY name SYSTEM "URI">
   * ```
   * - external (parsed) general "Public" entity declaration
   * ```text
   * <!ENTITY name PUBLIC "public_ID" "URI">
   * ```
   * - external (unparsed) general entity declaration
   * ```text
   * <!ENTITY name SYSTEM "URI" NDATA name>
   * <!ENTITY name PUBLIC "public_ID" "URI" NDATA name>
   * ```
   *
   * @param parser
   * @param declaration
   */
  parseEntity(parser: SAXParser, declaration: string[]): void {
    const entity = new EntityDeclaration(declaration);
    if (entity.value) parser.ENTITIES[entity.name] = entity.value;
  }
}
