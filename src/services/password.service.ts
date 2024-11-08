import * as bcrypt from "bcrypt";

class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}

export const passwordService = new PasswordService();
