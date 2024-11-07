import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "./interfaces/user.interface";

const pathToDb = path.join(process.cwd(), "db.json");

class FsService {
  public async read(): Promise<IUser[]> {
    const json = await fs.readFile(pathToDb, "utf-8");
    return json ? JSON.parse(json) : [];
  }
  public async write(users: IUser[]): Promise<void> {
    await fs.writeFile(pathToDb, JSON.stringify(users));
  }
}

export const fsService = new FsService();
