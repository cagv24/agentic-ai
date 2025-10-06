import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Advanced utility functions for AI and machine learning projects
 * This file contains comprehensive utilities for data processing, analysis, and manipulation
 */

// ==================== ARRAY UTILITIES ====================

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Flattens a nested array to specified depth
 */
export function flattenArray<T>(arr: any[], depth: number = 1): T[] {
  if (depth === 0) return arr.slice();
  return arr.reduce(
    (acc, val) =>
      acc.concat(Array.isArray(val) ? flattenArray(val, depth - 1) : val),
    []
  );
}

/**
 * Removes duplicates from array while preserving order
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Groups array elements by a key function
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}

/**
 * Finds intersection of multiple arrays
 */
export function arrayIntersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, arr) => acc.filter(item => arr.includes(item)));
}

/**
 * Finds union of multiple arrays (unique elements)
 */
export function arrayUnion<T>(...arrays: T[][]): T[] {
  return uniqueArray(arrays.flat());
}

/**
 * Finds difference between two arrays (elements in first but not second)
 */
export function arrayDifference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => !arr2.includes(item));
}

// ==================== MATHEMATICAL UTILITIES ====================

/**
 * Calculates mean of an array of numbers
 */
export function mean(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Calculates median of an array of numbers
 */
export function median(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculates standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  const avg = mean(numbers);
  const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

/**
 * Calculates variance
 */
export function variance(numbers: number[]): number {
  const avg = mean(numbers);
  return mean(numbers.map(num => Math.pow(num - avg, 2)));
}

/**
 * Calculates correlation coefficient between two arrays
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error('Arrays must have same length');

  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    sumSqX += diffX * diffX;
    sumSqY += diffY * diffY;
  }

  return numerator / Math.sqrt(sumSqX * sumSqY);
}

/**
 * Normalizes array to range [0, 1]
 */
export function normalize(numbers: number[]): number[] {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  return numbers.map(num => (num - min) / range);
}

/**
 * Standardizes array (z-score normalization)
 */
export function standardize(numbers: number[]): number[] {
  const avg = mean(numbers);
  const std = standardDeviation(numbers);
  return numbers.map(num => (num - avg) / std);
}

/**
 * Calculates percentile of a value in array
 */
export function percentile(numbers: number[], value: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = sorted.findIndex(num => num >= value);
  return index === -1 ? 100 : (index / sorted.length) * 100;
}

/**
 * Generates random number with normal distribution
 */
export function randomNormal(mean: number = 0, stdDev: number = 1): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

// ==================== STRING UTILITIES ====================

/**
 * Converts string to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, char) =>
    char ? char.toUpperCase() : ''
  );
}

/**
 * Converts string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Converts string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Capitalizes first letter of each word
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Removes extra whitespace and trims string
 */
export function cleanWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Truncates string to specified length with ellipsis
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = '...'
): string {
  return str.length <= length
    ? str
    : str.substring(0, length - suffix.length) + suffix;
}

/**
 * Calculates Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculates string similarity (0-1 based on Levenshtein distance)
 */
export function stringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  return (maxLength - levenshteinDistance(str1, str2)) / maxLength;
}

// ==================== OBJECT UTILITIES ====================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Deep merges two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = deepClone(target);

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Checks if value is a plain object
 */
export function isObject(value: any): value is Record<string, any> {
  return (
    value !== null && typeof value === 'object' && value.constructor === Object
  );
}

/**
 * Gets nested property value from object using dot notation
 */
export function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Sets nested property value in object using dot notation
 */
export function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Flattens nested object to dot notation keys
 */
export function flattenObject(
  obj: any,
  prefix: string = ''
): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (isObject(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// ==================== ASYNC UTILITIES ====================

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries an async function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      const delayMs = baseDelay * Math.pow(2, attempt - 1);
      await delay(delayMs);
      attempt++;
    }
  }

  throw new Error('Max attempts reached');
}

/**
 * Executes promises with concurrency limit
 */
export async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Times out a promise after specified milliseconds
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

// ==================== FILE SYSTEM UTILITIES ====================

/**
 * Ensures directory exists, creates it if it doesn't
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.promises.access(dirPath);
  } catch {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Reads JSON file with error handling
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error}`);
  }
}

/**
 * Writes JSON file with pretty formatting
 */
export async function writeJsonFile(
  filePath: string,
  data: any
): Promise<void> {
  try {
    await ensureDir(path.dirname(filePath));
    const content = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${error}`);
  }
}

/**
 * Gets file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await fs.promises.stat(filePath);
  return stats.size;
}

/**
 * Checks if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ==================== VALIDATION UTILITIES ====================

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if string is a valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if number is within range
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

// ==================== HASH AND CRYPTO UTILITIES ====================

/**
 * Generates MD5 hash of string
 */
export function md5Hash(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Generates SHA256 hash of string
 */
export function sha256Hash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Generates random UUID v4
 */
export function generateUuid(): string {
  return crypto.randomUUID();
}

/**
 * Generates random string of specified length
 */
export function generateRandomString(
  length: number,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// ==================== PERFORMANCE UTILITIES ====================

/**
 * Measures execution time of a function
 */
export async function measureTime<T>(
  fn: () => Promise<T> | T
): Promise<{ result: T; timeMs: number }> {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const timeMs = Number(end - start) / 1_000_000;
  return { result, timeMs };
}

/**
 * Simple debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// ==================== DATA TRANSFORMATION UTILITIES ====================

/**
 * Converts CSV string to array of objects
 */
export function csvToObjects(
  csv: string,
  delimiter: string = ','
): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      },
      {} as Record<string, string>
    );
  });
}

/**
 * Converts array of objects to CSV string
 */
export function objectsToCsv(
  objects: Record<string, any>[],
  delimiter: string = ','
): string {
  if (objects.length === 0) return '';

  const headers = Object.keys(objects[0]);
  const csvRows = [headers.join(delimiter)];

  objects.forEach(obj => {
    const values = headers.map(header => {
      const value = obj[header];
      return typeof value === 'string' && value.includes(delimiter)
        ? `"${value.replace(/"/g, '""')}"`
        : String(value);
    });
    csvRows.push(values.join(delimiter));
  });

  return csvRows.join('\n');
}

/**
 * Converts object to query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');
}

/**
 * Converts query string to object
 */
export function queryStringToObject(
  queryString: string
): Record<string, string> {
  const params = new URLSearchParams(
    queryString.startsWith('?') ? queryString.slice(1) : queryString
  );
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// ==================== LOGGING UTILITIES ====================

/**
 * Simple logger with different levels
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('info', message));
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  static error(message: string, error?: Error): void {
    console.error(this.formatMessage('error', message));
    if (error) {
      console.error(error.stack);
    }
  }

  static debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('debug', message));
    }
  }
}

/**
 * Creates a progress bar for long-running operations
 */
export class ProgressBar {
  private current = 0;
  private readonly total: number;
  private readonly width: number;

  constructor(total: number, width: number = 40) {
    this.total = total;
    this.width = width;
  }

  update(current: number): void {
    this.current = current;
    const percentage = Math.round((current / this.total) * 100);
    const filled = Math.round((current / this.total) * this.width);
    const bar = '█'.repeat(filled) + '░'.repeat(this.width - filled);

    process.stdout.write(
      `\r[${bar}] ${percentage}% (${current}/${this.total})`
    );

    if (current >= this.total) {
      process.stdout.write('\n');
    }
  }

  increment(): void {
    this.update(this.current + 1);
  }
}

// Export all utilities as a namespace for organized access
export const ArrayUtils = {
  shuffleArray,
  chunkArray,
  flattenArray,
  uniqueArray,
  groupBy,
  arrayIntersection,
  arrayUnion,
  arrayDifference,
};

export const MathUtils = {
  mean,
  median,
  standardDeviation,
  variance,
  correlation,
  normalize,
  standardize,
  percentile,
  randomNormal,
};

export const StringUtils = {
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toTitleCase,
  cleanWhitespace,
  truncate,
  levenshteinDistance,
  stringSimilarity,
};

export const ObjectUtils = {
  deepClone,
  deepMerge,
  isObject,
  getNestedProperty,
  setNestedProperty,
  flattenObject,
};

export const AsyncUtils = {
  delay,
  retry,
  pLimit,
  timeout,
};

export const FileUtils = {
  ensureDir,
  readJsonFile,
  writeJsonFile,
  getFileSize,
  fileExists,
};

export const ValidationUtils = {
  isValidEmail,
  isValidUrl,
  isValidJson,
  isInRange,
};

export const CryptoUtils = {
  md5Hash,
  sha256Hash,
  generateUuid,
  generateRandomString,
};

export const PerformanceUtils = {
  measureTime,
  debounce,
  throttle,
};

export const DataUtils = {
  csvToObjects,
  objectsToCsv,
  objectToQueryString,
  queryStringToObject,
};
