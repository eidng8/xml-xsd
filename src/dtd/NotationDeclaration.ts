/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DeclarationBase } from '../mixins/DeclarationBase';
import { HasExternal } from '../mixins/HasExternal';

export class NotationDeclaration extends HasExternal(DeclarationBase) {
  constructor(
    declaration: string,
    options?: { fetchFn: (uri: string) => Promise<string> },
  ) {
    // @ts-ignore: TS2554
    super(declaration, options);
  }

  parse(): NotationDeclaration {
    super.parse();
    this.parseExternal();
    return this;
  }
}
