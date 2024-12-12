export type PickRquiredType<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & {
  frontUrl?: string;
};
