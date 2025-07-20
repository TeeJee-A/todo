export type loginInput = {
  type: string;
  placeholder: string;
  name: "email" | "password";
};
export type registerInput = {
  type: string;
  placeholder: string;
  name:
    | "email"
    | "password"
    | "fullname"
    | "phone"
    | "text"
    | "address"
    | "image";
};
