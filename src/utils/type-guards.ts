/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  ICData,
  IComment,
  IDeclaration,
  IElement,
  IInstruction,
  IText,
  TNode,
} from '../types/xml';
import { IDocType } from '../types/xml/doctype';

export function isCDataNode(node: TNode): node is ICData {
  return 'cdata' == node.type;
}

export function isCommentNode(node: TNode): node is IComment {
  return 'comment' == node.type;
}

export function isDocTypeNode(node: TNode): node is IDocType {
  return 'doctype' == node.type;
}

export function isDeclarationNode(
  node: TNode | IDeclaration,
): node is IDeclaration {
  return !(node as TNode).type;
}

export function isElementNode(node: TNode): node is IElement {
  return 'element' == node.type;
}

export function isInstructionNode(node: TNode): node is IInstruction {
  return 'instruction' == node.type;
}

export function isTextNode(node: TNode): node is IText {
  return 'text' == node.type;
}
