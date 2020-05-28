/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Element, xml2js } from 'xml-js';
import G8DocType from './G8DocType';

export default class G8Xsd {
  private xsd!: Element;

  private schema!: object;

  constructor(schema?: string) {
    if (schema) this.load(schema);
  }

  load(schema: string): void {
    this.xsd = xml2js(schema, {
      doctypeFn: new G8DocType(this.schema).parser(),
    }) as Element;
    console.log(this.xsd);
  }
}
