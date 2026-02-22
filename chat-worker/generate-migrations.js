const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "src", "db", "migrations");
const indexPath = path.join(migrationsDir, "index.ts");

if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found. Run drizzle-kit first.");
    process.exit(0);
}

// Get all SQL migration files
const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

// Generate variable names from filenames (m0000, m0001, etc.)
const migrations = migrationFiles.map((file) => {
    const name = "m" + file.split("_")[0]; // Extract the number part
    return { name, file };
});

// Generate the index.ts content
let indexContent = `import journal from "./meta/_journal.json";\n`;

// Add imports with @ts-expect-error for .sql files (Wrangler esbuild text loader)
migrations.forEach((migration) => {
    indexContent += `// @ts-expect-error - Wrangler esbuild custom rule treats .sql as text\n`;
    indexContent += `import ${migration.name} from "./${migration.file}";\n`;
});

// Add exports
indexContent += `\nexport default {\n\tjournal,\n\tmigrations: {\n`;
migrations.forEach((migration, i) => {
    indexContent += `\t\t${migration.name}${i < migrations.length - 1 ? "," : ""}\n`;
});
indexContent += `\t},\n};\n`;

fs.writeFileSync(indexPath, indexContent);
console.log(`Generated index.ts with ${migrations.length} migrations`);
