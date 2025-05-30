type Header<T> = {
  column: keyof T | "actions";
  label: string;
  orderable?: boolean;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
};

export type { Header };
