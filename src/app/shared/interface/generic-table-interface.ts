export interface tableColumns<T> {
  id: string;
  key: keyof T,
  // render?: (row: T) => any;
  func?: (col: any) => any;
  subkey?: keyof T,
  icon?: string[],
  label: string,
}

