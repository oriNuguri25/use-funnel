import { describe, expect, test } from 'vitest';
import { makePath, parseQueryJson, removeKeys, stringifyQueryJson } from '../src/util';

describe('Test removeKeys', () => {
  test('should work', async () => {
    const value = { a: 1, b: 2, c: 3, d: [4, 5, 6], abc: 123 };

    expect(removeKeys(value, ['b', 'd'])).toEqual({ a: 1, c: 3, abc: 123 });
    expect(value).toEqual({ a: 1, b: 2, c: 3, d: [4, 5, 6], abc: 123 });

    expect(removeKeys(value, ['b', (key: string) => key.startsWith('a')])).toEqual({ c: 3, d: [4, 5, 6] });
  });
});

describe('Test makePath', () => {
  test('should work', async () => {
    const router = {
      asPath: '/path?foo=bar',
      pathname: '/path',
      query: { foo: 'bar' },
    };

    expect(makePath(router)).toEqual({ pathname: '/path', query: { foo: 'bar' } });
  });
  test('should remove path variable from query', async () => {
    const router = {
      asPath: '/path/123?foo=bar',
      pathname: '/path/[id]',
      query: { foo: 'bar', id: '123' },
    };

    expect(makePath(router)).toEqual({ pathname: '/path/123', query: { foo: 'bar' } });
  });
});

describe('Test stringifyQueryJson', () => {
  test('should work with date', async () => {
    const value = { a: 1, b: new Date('2025-04-15T14:28:09.987Z') };

    expect(stringifyQueryJson(value)).toEqual('{"a":1,"b":{"__type":"Date","value":"2025-04-15T14:28:09.987Z"}}');
  });

  test('should work with objects that do not inherit from Object.prototype', async () => {
    const objectWithoutPrototype = Object.create(null);
    objectWithoutPrototype.a = 1;
    objectWithoutPrototype.b = 2;

    const value = { a: 1, c: objectWithoutPrototype };

    expect(stringifyQueryJson(value)).toEqual('{"a":1,"c":{"a":1,"b":2}}');
  });
});

describe('Test parseQueryJson', () => {
  test('should work', async () => {
    const value = '{"a":1,"b":{"__type":"Date","value":"2025-04-15T14:28:09.987Z"}}';

    expect(parseQueryJson(value)).toEqual({ a: 1, b: new Date('2025-04-15T14:28:09.987Z') });
  });
});
