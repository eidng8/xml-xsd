/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { HasExternal } from '../mixins/HasExternal';

export class NotationDeclaration extends HasExternal {
  parse(): NotationDeclaration {
    super.parse();
    this.parseExternal();
    return this;
  }
}
