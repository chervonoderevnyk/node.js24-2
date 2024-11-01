import fs from "node:fs/promises";
import path from "node:path";

const pathToDb = path.join(process.cwd(), "db.json");

class FsService {
  public async read() {
    const json = await fs.readFile(pathToDb, "utf-8");
    return json ? JSON.parse(json) : [];
  }
  public async write(users) {
    await fs.writeFile(pathToDb, JSON.stringify(users));
  }
}

export const fsService = new FsService();
