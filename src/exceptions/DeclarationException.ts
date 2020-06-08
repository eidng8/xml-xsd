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
  protected readonly _message: string;

  readonly input: string;

  readonly context?: string;

  get message(): string {
    let msg = `${this._message || ''}\nINPUT: \`${this.input}\``;
    if (this.context) return `${msg}\nSOURCE: \`${this.context}\``;
    return msg;
  }

  constructor(input: string, context?: string, message?: string) {
    super();
    this.input = input;
    this.context = context;
    this._message = message || TEXTS.errInvalidDeclaration;
  }
}
