import { compare, genSalt, hashSync } from "bcrypt";

export const hashPassword = async ({
  password,
}: {
  password: string;
}): Promise<string> => {
  const hash = hashSync(password, await genSalt(10));
  return hash;
};

export const comparePassword = async ({
  candidatePassword,
  hashedPassword,
}: {
  candidatePassword: string;
  hashedPassword: string;
}): Promise<boolean> => {
  return compare(candidatePassword, hashedPassword).catch(() => false);
};
