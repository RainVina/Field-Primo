import { describe, expect, it } from 'vitest';
import { ROOT, type PhraseNode } from '../src/content/phrases';
import { currentOption, findNode, optionsOf, scanBack, scanNext, scanYes, startScan } from '../src/lib/tree';

describe('partner scanning', () => {
  it('starts at the first category', () => {
    expect(currentOption(startScan()).id).toBe('pain');
  });

  it('gets to "chest pain, very bad" in a few signals', () => {
    let s = startScan();
    let r = scanYes(s); // Pain
    if (r.kind !== 'move') throw new Error('expected move');
    s = r.state;
    r = scanNext(s); // Head -> Chest
    if (r.kind !== 'move') throw new Error('expected move');
    s = r.state;
    r = scanYes(s); // Chest
    if (r.kind !== 'move') throw new Error('expected move');
    s = r.state;
    s = (scanNext(s) as { state: typeof s }).state; // mild -> moderate
    s = (scanNext(s) as { state: typeof s }).state; // moderate -> severe
    const leaf = scanYes(s);
    expect(leaf.kind).toBe('leaf');
    if (leaf.kind === 'leaf') {
      expect(leaf.node.id).toBe('pain.chest.severe');
      expect(leaf.node.urgent).toBe(true);
      expect(leaf.node.say?.fil).toBe('Masakit ang dibdib ko. Sobrang sakit!');
    }
  });

  it('wraps to the start after the last option and says so', () => {
    let s = startScan();
    const n = optionsOf(ROOT).length;
    let wrapped = false;
    for (let i = 0; i < n; i++) {
      const r = scanNext(s);
      if (r.kind !== 'move') throw new Error('expected move');
      s = r.state;
      wrapped = !!r.wrapped;
    }
    expect(wrapped).toBe(true);
    expect(s.index).toBe(0);
  });

  it('goes back to the category it came from', () => {
    let s = startScan();
    s = (scanNext(s) as { state: typeof s }).state; // needs
    s = (scanYes(s) as { state: typeof s }).state; // into needs
    const back = scanBack(s);
    expect(back.path).toHaveLength(1);
    expect(currentOption(back).id).toBe('needs');
  });

  it('always offers "not here / other" as a real message', () => {
    const last = optionsOf(ROOT).at(-1)!;
    expect(last.id).toBe('root.other');
    expect(scanYes({ path: [ROOT], index: optionsOf(ROOT).length - 1 }).kind).toBe('leaf');
  });

  it('finds nodes by id, including generated "other" nodes', () => {
    expect(findNode('pain.head.mild')?.say?.en).toBe('My head hurts. Just a little.');
    expect(findNode('needs.other')?.id).toBe('needs.other');
    expect(findNode('nope')).toBeUndefined();
  });
});

describe('phrase content', () => {
  const all: PhraseNode[] = [];
  const walk = (n: PhraseNode) => {
    all.push(n);
    n.children?.forEach(walk);
  };
  walk(ROOT);

  it('has both languages for every text', () => {
    for (const n of all) {
      for (const text of [n.label, n.say, n.question, n.familyTip]) {
        if (!text) continue;
        expect(text.fil.trim(), n.id).not.toBe('');
        expect(text.en.trim(), n.id).not.toBe('');
      }
    }
  });

  it('has unique ids', () => {
    const ids = all.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every leaf something to say', () => {
    for (const n of all.filter((n) => !n.children)) expect(n.say, n.id).toBeDefined();
  });

  it('flags breathing trouble, severe pain and chest pain as urgent', () => {
    expect(findNode('feel.breathe')?.urgent).toBe(true);
    expect(findNode('pain.back.severe')?.urgent).toBe(true);
    expect(findNode('pain.chest.mild')?.urgent).toBe(true);
    expect(findNode('pain.back.mild')?.urgent).toBeFalsy();
  });
});
