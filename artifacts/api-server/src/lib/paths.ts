import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function getApiServerDir(moduleUrl: string): string {
  let current = path.dirname(fileURLToPath(moduleUrl));

  while (true) {
    const packageJsonPath = path.join(current, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
        name?: string;
      };

      if (packageJson.name === "@workspace/api-server") {
        return current;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Could not find @workspace/api-server package directory.");
    }

    current = parent;
  }
}
