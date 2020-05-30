/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Declaration, IDocument } from '../../src';

describe('XML Declaration', () => {
  it('should have default declaration', () => {
    expect.assertions(1);
    const dec = new Declaration((({
      nodes: [],
    } as unknown) as unknown) as IDocument);
    expect(dec).toEqual({
      attributes: {
        encoding: 'utf-8',
        version: '1.0',
        standalone: 'no',
      },
      parent: { nodes: [] },
    });
  });

  it('should has `encoding` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({} as unknown) as IDocument, {
      attributes: { encoding: 'ascii' },
      parent: ({} as unknown) as IDocument,
    });
    expect(dec.encoding).toBe('ascii');
  });

  it('should set `encoding` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({ nodes: [] } as unknown) as IDocument, {
      parent: ({} as unknown) as IDocument,
    });
    dec.encoding = 'iso-8859-1';
    expect(dec).toEqual({
      attributes: {
        encoding: 'iso-8859-1',
        version: '1.0',
        standalone: 'no',
      },
      parent: {},
    });
  });

  it('should has `version` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({} as unknown) as IDocument, {
      attributes: { version: '1.1' },
      parent: ({} as unknown) as IDocument,
    });
    expect(dec.version).toBe('1.1');
  });

  it('should set `version` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({ nodes: [] } as unknown) as IDocument, {
      parent: ({} as unknown) as IDocument,
    });
    dec.version = '1.1';
    expect(dec).toEqual({
      attributes: {
        encoding: 'utf-8',
        version: '1.1',
        standalone: 'no',
      },
      parent: {},
    });
  });

  it('should has `standalone` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({} as unknown) as IDocument, {
      attributes: { standalone: 'yes' },
      parent: ({} as unknown) as IDocument,
    });
    expect(dec.standalone).toBe(true);
  });

  it('should set `standalone` property', () => {
    expect.assertions(1);
    const dec = new Declaration(({ nodes: [] } as unknown) as IDocument, {
      parent: ({} as unknown) as IDocument,
    });
    dec.standalone = true;
    expect(dec).toEqual({
      attributes: {
        encoding: 'utf-8',
        version: '1.0',
        standalone: 'yes',
      },
      parent: {},
    });
  });
});
