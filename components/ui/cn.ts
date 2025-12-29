export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: boolean };

const pushClass = (value: ClassValue, classes: string[]): void => {
  if (!value) return;
  if (typeof value === 'string' || typeof value === 'number') {
    classes.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => pushClass(item, classes));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, enabled]) => {
      if (enabled) classes.push(key);
    });
  }
};

export const cn = (...inputs: ClassValue[]): string => {
  const classes: string[] = [];
  inputs.forEach((input) => pushClass(input, classes));
  return classes.join(' ');
};
