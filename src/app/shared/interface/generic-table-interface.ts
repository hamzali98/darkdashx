export interface tableColumns<T> {
  key: keyof T,
  render?: (row: T) => any;
  icon?: string[],
  label: string,
}