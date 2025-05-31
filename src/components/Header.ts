type Header<T> = {
  column: keyof T | string;
  label: string;
  orderable?: boolean;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
};

export type { Header };
