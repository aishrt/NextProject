interface Foo {
  [key: string]: string;
}
export const ErrorMessage: Foo = {
  "user-not-found": "User with this email not found!",
  "invalid-credentials": "Incorrect password!",
  "invalid-role-user": "Invalid role! You are not a user",
  "invalid-role-client": "Invalid role! You are not a client",
  "invalid-role-expert": "Invalid role! You are not a expert",
  "invalid-role-admin": "Invalid role! You are not an admin",
  "invalid-role-lawyer": "Invalid role! You are not an lawyer",
};
