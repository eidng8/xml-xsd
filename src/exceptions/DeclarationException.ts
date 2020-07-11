/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { TEXTS } from '../translations/en';

export type ExceptionConstructor = new (
  input: string,
  context: string,
  message?: string,
) => DeclarationException;

/**
 * General DOCTYPE declaration error. Also serves as the base of all DOCTYPE
 * exceptions.
 */
export class DeclarationException extends Error {
  /**
   * Maximum length of a truncated excerpt, including the ending ellipsis.
   * Defaults to `100`.
   */
  static excerptLength = 100;

  readonly input: string;

  readonly context?: string;

  protected readonly _message: string;

  get inputEllipsis(): string | undefined {
    if (!this.input) return undefined;
    return this.input.length > DeclarationException.excerptLength
      ? this.input.substr(0, DeclarationException.excerptLength - 3) + '...'
      : this.input;
  }

  get contextEllipsis(): string | undefined {
    if (!this.context) return undefined;
    return this.input.length > DeclarationException.excerptLength
      ? this.context.substr(0, DeclarationException.excerptLength - 3) + '...'
      : this.context;
  }

  get message(): string {
    let msg = `${this._message || ''}\nINPUT: \`${this.inputEllipsis}\``;
    if (this.context) return `${msg}\nSOURCE: \`${this.contextEllipsis}\``;
    return msg;
  }

  constructor(input: string, context?: string, message?: string) {
    super();
    this.input = input;
    this.context = context;
    this._message = message || TEXTS.errInvalidDeclaration;
  }
}
