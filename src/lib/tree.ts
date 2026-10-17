import { ROOT, otherNode, type PhraseNode } from '../content/phrases';

/** The options offered at a node, always ending with "not here / other". */
export function optionsOf(node: PhraseNode): PhraseNode[] {
  return [...(node.children ?? []), otherNode(node.id)];
}

export function isLeaf(node: PhraseNode): boolean {
  return !node.children || node.children.length === 0;
}

/*
 * Partner-assisted scanning: the relative offers options one at a time and
 * presses YES when the patient signals. The state is the path of categories
 * chosen so far plus which option is currently being offered.
 */
export interface ScanState {
  path: PhraseNode[];
  index: number;
}

export type ScanResult =
  | { kind: 'move'; state: ScanState; wrapped?: boolean }
  | { kind: 'leaf'; node: PhraseNode };

export function startScan(): ScanState {
  return { path: [ROOT], index: 0 };
}

export function currentList(state: ScanState): PhraseNode[] {
  return optionsOf(state.path[state.path.length - 1]);
}

export function currentOption(state: ScanState): PhraseNode {
  return currentList(state)[state.index];
}

/** Patient said YES to the option being offered. */
export function scanYes(state: ScanState): ScanResult {
  const option = currentOption(state);
  if (isLeaf(option)) return { kind: 'leaf', node: option };
  return { kind: 'move', state: { path: [...state.path, option], index: 0 } };
}

/** Patient said NO (or didn't signal): offer the next option, wrapping around. */
export function scanNext(state: ScanState): ScanResult {
  const length = currentList(state).length;
  const next = state.index + 1;
  if (next >= length) return { kind: 'move', state: { ...state, index: 0 }, wrapped: true };
  return { kind: 'move', state: { ...state, index: next } };
}

/** Go up one level, landing on the category we came from. */
export function scanBack(state: ScanState): ScanState {
  if (state.path.length <= 1) return { ...state, index: 0 };
  const path = state.path.slice(0, -1);
  const left = state.path[state.path.length - 1];
  const index = Math.max(0, optionsOf(path[path.length - 1]).findIndex((n) => n.id === left.id));
  return { path, index };
}

export function atRoot(state: ScanState): boolean {
  return state.path.length === 1;
}

/** Look a phrase up by id (used to show its family tip from history). */
export function findNode(id: string, node: PhraseNode = ROOT): PhraseNode | undefined {
  if (id === `${node.id}.other`) return otherNode(node.id);
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNode(id, child);
    if (found) return found;
  }
  return undefined;
}
