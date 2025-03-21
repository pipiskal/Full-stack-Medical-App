import { checkNameValidity, checkPasswordStrength } from './helpers';

describe('checkNameValidity', () => {
  test('should return "passed" for a valid name', () => {
    const result = checkNameValidity('john_doe');
    expect(result).toBe('passed');
  });
  test('should return "invalid_name" for a name with invalid characters', () => {
    const result = checkNameValidity('john@doe');
    expect(result).toBe('invalid_name');
  });
  test('should return "name_name_should_be" for a name with length less than 3', () => {
    const result = checkNameValidity('ab');
    expect(result).toBe('name_name_should_be');
  });
  test('should return "name_name_should_be" for a name with length greater than 20', () => {
    const result = checkNameValidity(
      'this_is_a_very_long_name_that_exceeds_the_maximum_length'
    );
    expect(result).toBe('name_name_should_be');
  });
});

describe('checkPasswordStrength', () => {
  test('should return "good" for a strong password', () => {
    expect(checkPasswordStrength('Abc123!@#')).toBe('good');
  });
  test('should return "normal" for a medium strength password', () => {
    expect(checkPasswordStrength('Abc123')).toBe('normal');
  });
  test('should return "weak" for a weak password', () => {
    expect(checkPasswordStrength('AbcD')).toBe('weak');
  });
  test('should return "poor" for an invalid password', () => {
    expect(checkPasswordStrength('abc123')).toBe('poor');
  });
  test('should return "poor" for an empty password', () => {
    expect(checkPasswordStrength('')).toBe('poor');
  });
  test('should return "poor" for a password with only lowercase letters', () => {
    expect(checkPasswordStrength('abcdefg')).toBe('poor');
  });
  test('should return "poor" for a password with only uppercase letters', () => {
    expect(checkPasswordStrength('ABCDEFG')).toBe('poor');
  });
  test('should return "poor" for a password with only numbers', () => {
    expect(checkPasswordStrength('123456')).toBe('poor');
  });
  test('should return "poor" for a password with only special characters', () => {
    expect(checkPasswordStrength('!@#$%^&*')).toBe('poor');
  });
});

describe('getLanguageFromCookie', () => {
  beforeEach(() => {
    // Mocking document.cookie for testing purposes
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'language=en; otherCookie=value',
    });
  });
  afterEach(() => {
    // Resetting document.cookie after each test
    document.cookie = '';
  });
  // test('should return "en" when language cookie exists', () => {
  //   const result = getLanguageFromCookie();
  //   expect(result).toBe('en');
  // });
  // test('should return "en" when language cookie does not exist', () => {
  //   document.cookie = 'otherCookie=value';
  //   const result = getLanguageFromCookie();
  //   expect(result).toBe('en');
  // });
  // test('should return "en" when language cookie value is empty', () => {
  //   document.cookie = 'language=; otherCookie=value';
  //   const result = getLanguageFromCookie();
  //   expect(result).toBe('en');
  // });
  // test('should return "en" when language cookie value is not present', () => {
  //   document.cookie = 'language; otherCookie=value';
  //   const result = getLanguageFromCookie();
  //   expect(result).toBe('en');
  // });
  // test('should return "en" when cookie string is empty', () => {
  //   document.cookie = '';
  //   const result = getLanguageFromCookie();
  //   expect(result).toBe('en');
  // });
});
