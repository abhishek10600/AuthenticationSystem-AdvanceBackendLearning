export type ApiResponnse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
