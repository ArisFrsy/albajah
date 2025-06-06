type Header<T> = {
  column: keyof T | string;
  label: string;
  orderable?: boolean;
  align?: "left" | "right" | "center";
  render?: (_row: T) => React.ReactNode;
};

export type { Header };
