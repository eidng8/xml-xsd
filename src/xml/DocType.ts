/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SAXParser } from 'sax';
import External from '../dtd/External';
import { IEntityDeclaration, IEntityList } from '../types/dtd';
import { IDocType, IDocument } from '../types/xml';
import { TEXTS } from '../translations/en';
import EntityDeclaration from '../dtd/EntityDeclaration';

/**
 * Due to the synchronous nature of `sax.js`, externals are not supported.
 */
export default class DocType implements IDocType {
  readonly type = 'doctype' as 'doctype';

  dtd = { entities: {} as IEntityList } as any;

  /**
   * Parameter entities
   */
  variables = [];

  private _doctype!: string;

  private _parent!: IDocument;

  get parent(): IDocument {
    return this._parent;
  }

  get doctype(): string {
    return this._doctype;
  }

  constructor(dtd?: string) {
    if (dtd) this.parseDtd(dtd.trim());
  }

  getEntity(name: string): IEntityDeclaration {
    return this.dtd.entities[name];
  }

  parser(): (value: string, parent: IDocument) => DocType {
    const self = this;
    return function (
      this: SAXParser,
      value: string,
      parent: IDocument,
    ): DocType {
      self._doctype = value;
      self._parent = parent;
      // const bp = value.indexOf('[');
      // if (bp < 0) {
      //   self.parseRoot(value);
      // } else {
      //   self.parseRoot(value.substring(0, bp));
      //   self.parseInternal(value.substr(bp), this);
      // }
      return self;
    };
  }

  parseDtd(dtd: string): void {
    const bp = dtd.indexOf('[');
    if (bp < 0) {
      this.parseRoot(dtd);
    } else {
      if (']' != dtd[dtd.length - 1]) throw new Error(TEXTS.errInvalidDocType);
      this.parseRoot(dtd.substring(0, bp));
      this.parseInternal(dtd.substring(bp + 1, dtd.length - 2));
    }
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
    if (!buf.length) throw new Error(TEXTS.errInvalidDocType);
    this.dtd.root = buf.shift();
    this.dtd.external = new External(...buf);
  }

  parseInternal(dtd: string): void {
    let idx = 0;
    let markup = '';
    let match;
    while ((match = DocType.extractMarkup(dtd, idx))) {
      [markup, idx] = match;
      if ('%' == markup[0] || '&' == markup[0]) {
        this.expandEntity(markup.substr(1, markup.length - 2));
      } else {
        this.parseMarkup(markup);
      }
    }
  }

  parseMarkup(dec: string): void {
    let matches = [] as string[];
    let match: RegExpExecArray | null;
    const regex = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?/g;
    while ((match = regex.exec(dec))) matches.push(match[0]);
    if (!matches.length) return;
    switch (matches.shift()) {
      case '!ENTITY':
        this.parseEntity(matches);
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
  parseEntity(declaration: string[]): void {
    const entity = new EntityDeclaration(declaration);
    this.dtd.entities[entity.name] = entity;
    // if (entity.general && entity.value)
    //   parser.ENTITIES[entity.name] = entity.value;
  }

  private static extractMarkup(
    dtd: string,
    start: number,
  ): [string, number] | null {
    let c = '';
    let s = -1;
    while (start < dtd.length) {
      c = dtd[start++];
      if (-1 == s && ('%' == c || '&' == c)) {
        const i = dtd.indexOf(';', start);
        return [dtd.substring(start, i), i + 1];
      } else if ('<' == c) {
        s = start;
      } else if ('>' == c) {
        if (-1 == s) throw new Error(TEXTS.errInvalidDeclaration);
        return [dtd.substring(s, start - 1), start];
      }
    }
    return null;
  }

  private expandEntity(entity: string) {
    Object.assign(this.dtd.entities, this.dtd.entities[entity].expand());
  }
}
