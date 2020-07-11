/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SAXParser } from 'sax';
import { External } from '../dtd/External';
import { IEntityDeclaration } from '../types/dtd/EntityDeclaration';
import { IEntityList } from '../types/dtd/EntityList';
import { IDocType } from '../types/xml/doctype';
import { IDocument } from '../types/xml/document';
import EntityDeclaration from '../dtd/EntityDeclaration';
import { decompose, extractMarkup } from '../utils/markup';
import { InvalidExternalID } from '../exceptions/InvalidExternalID';
import { DeclarationException } from '../exceptions/DeclarationException';
import { InvalidIntSubset } from '../exceptions/InvalidIntSubset';
import { IExternalOptions } from '../types/xml';

/**
 * Due to the synchronous nature of `sax.js`, externals are not supported.
 */
export default class DocType implements IDocType {
  readonly type = 'doctype' as 'doctype';

  private readonly options?: IExternalOptions;

  private dtd = {
    root: '',
    entities: {
      general: {} as IEntityList,
      parameter: {} as IEntityList,
    },
  };

  private _doctype = '';

  private _parent?: IDocument;

  get parent(): IDocument | undefined {
    return this._parent;
  }

  get doctype(): string {
    return this._doctype;
  }

  get rootElement(): string {
    return this.dtd.root;
  }

  constructor(options?: IExternalOptions) {
    this.options = options;
  }

  getEntity(name: string): IEntityDeclaration {
    return this.dtd.entities.general[name];
  }

  async parse(dtd: string) {
    await this.parseDtd(dtd.trim());
  }

  parser(): (value: string, parent: object) => DocType {
    const self = this;
    return function (this: SAXParser, value: string, parent: object): DocType {
      self._doctype = value;
      self._parent = parent as IDocument;
      Object.assign(this.ENTITIES, self.dtd.entities.general);
      return self;
    };
  }

  private async parseDtd(dtd: string): Promise<void> {
    const bp = dtd.indexOf('[');
    if (bp < 0) {
      try {
        await this.parseRoot(dtd);
      } catch (e) {
        throw new DeclarationException(e.input || dtd, e.context, e.message);
      }
    } else {
      const ep = dtd.lastIndexOf(']');
      if (-1 == ep) {
        throw new InvalidIntSubset(dtd);
      }
      try {
        await this.parseRoot(dtd.substring(0, bp));
        await this.parseInternal(dtd.substring(bp, ep + 1));
      } catch (e) {
        throw new DeclarationException(e.input, e.context, e.message);
      }
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
    const buf = decompose(dtd);
    this.dtd.root = buf.shift()!;
    await this.parseExternal(buf);
  }

  private async parseExternal(externalDecl: string[]): Promise<void> {
    if (!externalDecl.length) return;
    let external: External, id!: string;
    try {
      id = externalDecl.join(' ');
      external = new External(externalDecl, this.options);
    } catch (e) {
      throw new InvalidExternalID(id);
    }
    const markup = await external.fetch();
    const doctype = new DocType(this.options);
    await doctype.parseInternal(markup);
    Object.assign(this.dtd.entities.general, doctype.dtd.entities.general);
    Object.assign(this.dtd.entities.parameter, doctype.dtd.entities.parameter);
  }

  private async parseInternal(dtd: string): Promise<void> {
    if (!dtd || /\s*\[\s*]\s*/.test(dtd)) return;
    if (/^\s*\[/.test(dtd)) {
      dtd = dtd.substring(dtd.indexOf('[') + 1, dtd.lastIndexOf(']')).trim();
    }
    let idx = 0;
    let markup = '';
    let match: [string, number] | null;
    while ((match = extractMarkup(dtd, idx))) {
      [markup, idx] = match;
      if ('&' == markup[0]) {
        await this.expandEntity(markup.substr(1, markup.length - 2));
      } else if ('%' == markup[0]) {
        await this.expandParameter(markup.substr(1, markup.length - 2));
      } else {
        this.parseMarkup(markup);
      }
    }
  }

  private parseMarkup(declaration: string): void {
    if (declaration.startsWith('<!ENTITY')) this.parseEntity(declaration);
    else throw new DeclarationException(declaration);
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
  private parseEntity(declaration: string): void {
    const entity = new EntityDeclaration(declaration).parse();
    if (entity.isParameter) this.dtd.entities.parameter[entity.name] = entity;
    else this.dtd.entities.general[entity.name] = entity;
  }

  private async expandEntity(entity: string): Promise<void> {
    const ent = this.getEntity(entity);
    const v = await ent.value;
    if (v) await this.parseInternal(v);
  }

  private async expandParameter(entity: string): Promise<void> {
    const ent = this.dtd.entities.parameter[entity];
    const v = await ent.value;
    if (v) await this.parseInternal(v);
  }
}
