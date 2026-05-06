import { UserData } from '@domain/g02/g02-d01/local/type';

/**
 * Hash a string to a number using a simple hash function.
 * This function is not cryptographically secure and should not be used for sensitive data.
 *
 * This function can return negative number
 *
 * @param str string
 * @returns number
 *
 * @example
 * hashStringToNumber('hello world') // 1794106052
 */
export function hashStringToNumber(str: string) {
  let hash = 0;
  let i, chr;
  // if string is empty return 0
  if (str.length === 0) return hash;

  // loop through each character in the string
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Hash a user to certain number for use in some use cases,
 * e.g. use the hashing number of user for selecting the temporary image
 *
 * This function can still return the number even if the user is not exist
 * This function can return negative number
 *
 * @param user UserData
 * @returns number
 */
export function hashUserDataToNumber(user: UserData | Partial<UserData>) {
  if (!user?.first_name && !user?.last_name) return 0;
  return hashStringToNumber(`${user.first_name} ${user.last_name}`);
}
