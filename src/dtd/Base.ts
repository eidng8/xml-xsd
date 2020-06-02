import { TEXTS, validateName } from '..';

export class Base {
  readonly declaration: string;

  protected readonly parts: string[];

  protected _name!: string;

  get name(): string {
    return this._name;
  }

  constructor(declaration: string) {
    this.declaration = declaration;
    let match: RegExpExecArray | null;
    let matches = [] as string[];
    const regex = /'[^']+'|"[^"]+"|[^\s<>\/=]+/g;
    while ((match = regex.exec(declaration))) matches.push(match[0]);
    if (!matches.length) throw new Error(TEXTS.errInvalidDeclaration);
    this.parts = matches.slice(1);
    if (!this.parts || this.parts.length < 2) {
      throw new Error(TEXTS.errInvalidEntityDeclaration);
    }
    this._name = this.parseName();
  }

  /**
   * Will mutate `declaration`
   */
  protected parseName(): string {
    return validateName(this.parts.shift()!, this.declaration);
  }
}
