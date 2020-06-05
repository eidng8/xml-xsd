/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { DeclarationBase } from '../mixins/DeclarationBase';
import { HasExternal } from '../mixins/HasExternal';

export class NotationDeclaration extends HasExternal(DeclarationBase) {
  parse(): NotationDeclaration {
    super.parse();
    this.parseExternal();
    return this;
  }
}
