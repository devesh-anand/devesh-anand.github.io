import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const database = isLocal
  ? createLocalDatabase()
  : createDatabase({ provider: GitHubProvider });

export default database;
