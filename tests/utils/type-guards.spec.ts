/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  isCDataNode,
  isCommentNode,
  isDeclarationNode,
  isDocTypeNode,
  isElementNode,
  isInstructionNode,
  isTextNode,
  TNode,
} from '../../src';

describe('Type guards', () => {
  it('checks CDATA', () => {
    expect.assertions(1);
    expect(isCDataNode({ type: 'cdata' } as TNode)).toBe(true);
  });

  it('checks comment', () => {
    expect.assertions(1);
    expect(isCommentNode({ type: 'comment' } as TNode)).toBe(true);
  });

  it('checks DOCTYPE', () => {
    expect.assertions(1);
    expect(isDocTypeNode({ type: 'doctype' } as TNode)).toBe(true);
  });

  it('checks declaration', () => {
    expect.assertions(1);
    expect(isDeclarationNode({} as TNode)).toBe(true);
  });

  it('checks element', () => {
    expect.assertions(1);
    expect(isElementNode({ type: 'element' } as TNode)).toBe(true);
  });

  it('checks instruction', () => {
    expect.assertions(1);
    expect(isInstructionNode({ type: 'instruction' } as TNode)).toBe(true);
  });

  it('checks text', () => {
    expect.assertions(1);
    expect(isTextNode({ type: 'text' } as TNode)).toBe(true);
  });
});
