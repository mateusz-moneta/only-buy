export interface Input {
  [key: string]: {
    value: boolean | FileList | number | string | null;
    valid: boolean;
    nullable?: boolean;
  };
}
