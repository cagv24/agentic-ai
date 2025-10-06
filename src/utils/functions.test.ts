import {
  calc,
  fn1,
  helperFunc,
  proc,
  process,
  transform,
} from './bad-practices.js';

describe('Bad Practices Tests - ~70% Coverage', () => {
  describe('fn1 - multiply array elements by value', () => {
    test('should multiply array elements by value', () => {
      const input = [1, 2, 3, 4, 5];
      const multiplier = { value: 2 };
      const result = fn1(input, multiplier);
      expect(result).toBe(30);
    });

    test('should work with negative numbers', () => {
      const input = [1, -2, 3];
      const multiplier = { value: 3 };
      const result = fn1(input, multiplier);
      expect(result).toBe(6);
    });
  });

  describe('calc - calculate sum and average from CSV string', () => {
    test('should parse CSV and calculate sum and average', () => {
      const data = '10,20,30,40';
      const result = calc(data);
      expect(result.t).toBe(100);
      expect(result.a).toBe(25);
      expect(result.c).toBe(4);
    });

    test('should handle single value', () => {
      const data = '50';
      const result = calc(data);
      expect(result.t).toBe(50);
      expect(result.a).toBe(50);
      expect(result.c).toBe(1);
    });
  });

  describe('proc - process object with hyphenated value', () => {
    test('should split hyphenated string into parts', () => {
      const obj = { name: 'John-Doe-Smith' };
      const result = proc(obj, 'name');
      expect(result.f).toBe('John');
      expect(result.l).toBe('Doe');
      expect(result.m).toBe('Smith');
    });

    test('should work with different key', () => {
      const obj = { id: 'A-B-C' };
      const result = proc(obj, 'id');
      expect(result.f).toBe('A');
      expect(result.l).toBe('B');
      expect(result.m).toBe('C');
    });
  });

  describe('transform - categorize values', () => {
    test('should categorize values as high, medium, or low', () => {
      const input = { a: 150, b: 75, c: 25 };
      const result = transform(input);
      expect(result.a).toBe('high');
      expect(result.b).toBe('medium');
      expect(result.c).toBe('low');
    });

    test('should handle boundary values', () => {
      const input = { x: 100, y: 50 };
      const result = transform(input);
      expect(result.x).toBe('medium');
      expect(result.y).toBe('low');
    });
  });

  describe('process - filter and transform array', () => {
    test('should process valid items', () => {
      const arr = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 },
      ];
      const transformFn = (item: any) => ({
        valid: item.value > 15,
        data: item.value * 2,
      });

      const result = process(arr, transformFn);
      expect(result).toEqual([40, 60]);
    });

    test('should return all items when all are valid', () => {
      const arr = [{ x: 1 }, { x: 2 }];
      const transformFn = (item: any) => ({
        valid: true,
        data: item.x + 10,
      });

      const result = process(arr, transformFn);
      expect(result).toEqual([11, 12]);
    });
  });

  describe('helperFunc - simple calculation', () => {
    test('should double value and add 10', () => {
      expect(helperFunc(5)).toBe(20);
    });

    test('should work with zero', () => {
      expect(helperFunc(0)).toBe(10);
    });
  });
});
