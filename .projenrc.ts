import { Vitest } from "@nikovirtala/projen-vitest";
import { javascript, typescript } from "projen";

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: "main",
  name: "@nikovirtala/typesafe-dynamodb",
  projenrcTs: true,
  typescriptVersion: "latest",
  repository: "https://github.com/nikovirtala/typesafe-dynamodb",
  tsconfig: {
    compilerOptions: {
      lib: ["ES2023"],
      module: "NodeNext",
      moduleResolution: javascript.TypeScriptModuleResolution.NODE_NEXT,
      target: "ES2023",
    },
  },
  deps: ["zod"],
  devDeps: ["@nikovirtala/projen-vitest"],
  peerDeps: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/types",
    "@aws-sdk/util-dynamodb",
    "@smithy/smithy-client",
    "@types/aws-lambda",
  ],
  gitignore: [".DS_Store", ".dccache"],
  releaseToNpm: true,
  prettier: true,
  dependabot: false,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ["auto-approve", "auto-merge"],
    },
  },
  autoApproveOptions: {
    secret: "GITHUB_TOKEN",
    allowedUsernames: ["nikovirtala"],
  },
  mergify: true,
  autoMerge: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  npmTrustedPublishing: true,
  jest: false,
  minNodeVersion: "22.15.0",
  packageManager: javascript.NodePackageManager.PNPM,
});

project.package.addField("type", "module");

project.deps.removeDependency("ts-node");
project.addDevDeps("tsx");
project.defaultTask?.reset();
project.defaultTask?.exec(
  `tsx --tsconfig ${project.tsconfigDev?.file.path} .projenrc.ts`,
);

new Vitest(project);

project.synth();
