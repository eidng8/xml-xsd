/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SAXParser } from 'sax';
import { External } from '../dtd/External';
import { IEntityDeclaration, IEntityList } from '../types/dtd';
import { IDocType } from '../types/xml/doctype';
import { IDocument } from '../types/xml/document';
import { TEXTS } from '../translations/en';
import EntityDeclaration from '../dtd/EntityDeclaration';
import { extractMarkup } from '../utils/dtd';

/**
 * Due to the synchronous nature of `sax.js`, externals are not supported.
 */
export default class DocType implements IDocType {
  readonly type = 'doctype' as 'doctype';

  private dtd = {
    root: '',
    external: {} as External,
    entities: {} as IEntityList,
  };

  private _doctype = '';

  private _parent?: IDocument;

  private readonly urlBase: string;

  get parent(): IDocument | undefined {
    return this._parent;
  }

  get doctype(): string {
    return this._doctype;
  }

  get rootElement(): string {
    return this.dtd.root;
  }

  constructor(urlBase = '') {
    this.urlBase = urlBase;
  }

  getEntity(name: string): IEntityDeclaration {
    return this.dtd.entities[name];
  }

  async parse(dtd: string) {
    await this.parseDtd(dtd.trim());
  }

  parser(): (value: string, parent: object) => DocType {
    const self = this;
    return function (this: SAXParser, value: string, parent: object): DocType {
      self._doctype = value;
      self._parent = parent as IDocument;
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

  private async parseDtd(dtd: string): Promise<void> {
    const bp = dtd.indexOf('[');
    if (bp < 0) {
      await this.parseRoot(dtd);
    } else if (']' != dtd[dtd.length - 1]) {
      throw new Error(TEXTS.errInvalidIntSubset);
    } else {
      await this.parseRoot(dtd.substring(0, bp));
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
  private async parseRoot(dtd: string): Promise<void> {
    let match: RegExpExecArray | null;
    const buf = [] as string[];
    const reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?/g;
    while ((match = reg.exec(dtd))) buf.push(match[0]);
    if (!buf.length) throw new Error(TEXTS.errInvalidDocType);
    this.dtd.root = buf.shift()!;
    await this.parseExternal(buf);
  }

  private async parseExternal(externalID: string[]): Promise<void> {
    if (!externalID.length) return;
    const ext = new External(
      ...(externalID as ['PUBLIC' | 'SYSTEM', string, string]),
    );
    const markup = await ext.fetch(this.urlBase);
    const external = new DocType(this.urlBase);
    await external.parseInternal(markup);
    Object.assign(this.dtd.entities, external.dtd.entities);
  }

  private parseInternal(dtd: string): void {
    let idx = 0;
    let markup = '';
    let match;
    while ((match = extractMarkup(dtd, idx))) {
      [markup, idx] = match;
      if ('%' == markup[0] || '&' == markup[0]) {
        this.expandEntity(markup.substr(1, markup.length - 2));
      } else {
        this.parseMarkup(markup);
      }
    }
  }

  private parseMarkup(dec: string): void {
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
   * @param declaration
   */
  private parseEntity(declaration: string[]): void {
    const entity = new EntityDeclaration(declaration);
    this.dtd.entities[entity.name] = entity;
    // if (entity.general && entity.value)
    //   parser.ENTITIES[entity.name] = entity.value;
  }

  private expandEntity(entity: string) {
    Object.assign(this.dtd.entities, this.dtd.entities[entity].expand());
  }
}
