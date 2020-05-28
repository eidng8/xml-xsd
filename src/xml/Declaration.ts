/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IDeclaration, IDocument } from '../types/xml';

export default class Declaration implements IDeclaration {
  readonly attributes: {
    encoding: string;
    version: '1.0' | '1.1';
    standalone: 'yes' | 'no';
  };

  readonly parent: IDocument;

  get encoding(): string {
    return this.attributes.encoding;
  }

  set encoding(value: string) {
    this.attributes.encoding = value;
  }

  get version(): '1.0' | '1.1' {
    return this.attributes.version;
  }

  set version(value: '1.0' | '1.1') {
    this.attributes.version = value;
  }

  get standalone(): boolean {
    return 'yes' == this.attributes.standalone;
  }

  set standalone(value: boolean) {
    this.attributes.standalone = value ? 'yes' : 'no';
  }

  constructor(doc: IDocument, dec?: IDeclaration | Declaration) {
    this.attributes = Object.assign(
      { encoding: 'utf-8', version: '1.0', standalone: 'no' },
      dec ? dec.attributes : {},
    );
    this.parent = (dec && dec.parent) || doc;
  }
}
