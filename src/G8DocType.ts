/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { SAXParser } from 'sax';

export default class G8DocType {
  schema: object;

  declaration = {} as any;

  constructor(schema: object) {
    this.schema = schema;
  }

  parser(): (value: string, parentElement: object) => void {
    const self = this;
    return function (
      this: SAXParser,
      value: string /*, parent: object*/,
    ): void {
      const bp = value.indexOf(',');
      if (bp < 0) {
        self.parseRoot(value);
      } else {
        self.parseRoot(value.substr(0, bp));
      }
      // const rootReg = XRegExp(
      //   '^\\s*([_\\p{L}][-_\\p{L}]+)\\s*\\[(.+)\\s*]\\s*$',
      //   's',
      // );
      // const rootMatches = rootReg.exec(value);
      // if (rootMatches && rootMatches.length) self.root = rootMatches[1];
    };
  }

  private parseRoot(dtd: string): void {
    let match: RegExpExecArray | null;
    const buf = [] as string[];
    const reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    while ((match = reg.exec(dtd))) buf.push(match[0]);
    if (!buf.length) throw new Error('Invalid DOCTYPE');
    this.declaration.root = buf.shift();
    this.loadExternalDtd(buf);
  }

  private loadExternalDtd(external: string[]): void {
    if (!external || !external.length) return;
    this.declaration.externals = [];
  }
}
