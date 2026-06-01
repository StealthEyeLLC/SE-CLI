import { readFile, writeFile } from "node:fs/promises";

const target = new URL("../src/index.ts", import.meta.url);
let source = await readFile(target, "utf8");

source = source.replace(
  "const runtimeMode = \"real-mcp-github-backed-docs\";",
  "const runtimeMode = \"real-mcp-proof-control\";"
);

source = source.replace(
  "import { createStateCard } from \"@stealtheye/se-core\";",
  "import { createStateCard } from \"@stealtheye/se-core\";\nimport { callControlTool, controlInputSchema, controlTools } from \"./control.js\";"
);

source = source.replace(
  "const lowerPath = repoPath.toLowerCase();\n  if (blockedPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {",
  "const lowerPath = repoPath.toLowerCase();\n  const allowedWorkflowPath = lowerPath === \".github/workflows/ci.yml\";\n  if (allowedWorkflowPath) {\n    return;\n  }\n  if (blockedPrefixes.some((prefix) => lowerPath.startsWith(prefix))) {"
);

source = source.replace(
  "const index = lines.findIndex((line) => line.trim() === marker.trim());\n  if (index < 0) {\n    return null;\n  }\n  for (const line of lines.slice(index + 1)) {\n    const trimmed = line.trim();\n    if (trimmed) {\n      return trimmed.replace(/^[-*]\\s*/, \"\");\n    }\n  }\n  return null;",
  "const line = lines.find((candidate) => candidate.trim().startsWith(marker.trim()));\n  if (!line) {\n    return null;\n  }\n  return line.trim().slice(marker.trim().length).trim();"
);

source = source.replace(
  "...readTools,",
  "...readTools,\n      ...controlTools.map((tool) => ({\n        name: tool.name,\n        description: tool.description,\n        inputSchema: controlInputSchema(),\n        annotations: {\n          readOnlyHint: true,\n          destructiveHint: false,\n          openWorldHint: true,\n        },\n      })),"
);

source = source.replace(
  "if (name === \"se.get_state_card\") {",
  "const controlResult = await callControlTool(name, args);\n  if (controlResult) {\n    return controlResult;\n  }\n\n  if (name === \"se.get_state_card\") {"
);

await writeFile(target, source, "utf8");
