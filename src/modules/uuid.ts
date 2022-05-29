/**
 * UUID V4 を返す 参考: https://qiita.com/psn/items/d7ac5bdb5b5633bae165
 * @returns uuidv4文字列を返す
 */
export const generateUuid = (): string => {
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join("");
}