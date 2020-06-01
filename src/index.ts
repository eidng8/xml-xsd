/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export * from './types/dtd/DtdExternalType';
export * from './types/dtd/EntityDeclaration';
export * from './types/dtd/EntityList';
export * from './types/dtd/EntityState';

export * from './types/xml';
export * from './types/xml/doctype';
export * from './types/xml/document';
export * from './types/parse';

export * from './utils/dtd';
export * from './utils/timer';
export * from './utils/type-guards';
export * from './utils/validators';

export * from './translations/en';

export * from './dtd/External';

export * from './dtd/NotationDeclaration';
export { default as EntityDeclaration } from './dtd/EntityDeclaration';
export { default as DocType } from './xml/DocType';
export { default as Document } from './xml/Document';
export { default as Declaration } from './xml/Declaration';
