import journal from "./meta/_journal.json";
// @ts-expect-error - Wrangler esbuild custom rule treats this as string
import m0000 from "./0000_damp_zemo.sql";

const migrationsFiles = {
	journal,
	migrations: {
		m0000
	},
};

export default migrationsFiles;
