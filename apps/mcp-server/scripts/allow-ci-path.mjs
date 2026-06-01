import { readFile, writeFile } from "node:fs/promises";

const target = new URL("../src/index.ts", import.meta.url);
let source = await readFile(target, "utf8");

source = source.replace(
  "const runtimeMode = \"real-mcp-github-backed-docs\";",
  "const runtimeMode = \"real-mcp-ci-workflow-allowlist\";"
);

source = source.replace(
  "const lowerPath = repoPath.toLowerCase();\n  if (blockedPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {",
  "const lowerPath = repoPath.toLowerCase();\n  const allowedWorkflowPath = lowerPath === \".github/workflows/ci.yml\";\n  if (allowedWorkflowPath) {\n    return;\n  }\n  if (blockedPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {"
);

source = source.replace(
  "const index = lines.findIndex((line) => line.trim() === marker.trim());\n  if (index < 0) {\n    return null;\n  }\n  for (const line of lines.slice(index + 1)) {\n    const trimmed = line.trim();\n    if (trimmed) {\n      return trimmed.replace(/^[-*]\\s*/, \"\");\n    }\n  }\n  return null;",
  "const line = lines.find((candidate) => candidate.trim().startsWith(marker.trim()));\n  if (!line) {\n    return null;\n  }\n  return line.trim().slice(marker.trim().length).trim();"
);

await writeFile(target, source, "utf8");
