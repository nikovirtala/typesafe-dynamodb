import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'typesafe-dynamodb',
  projenrcTs: true,
  typescriptVersion: 'latest',
  repository: 'https://github.com/sam-goodwin/typesafe-dynamodb',
  peerDeps: [
    'aws-sdk',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
    '@aws-sdk/types',
    '@aws-sdk/util-dynamodb',
    '@smithy/smithy-client',
    '@types/aws-lambda',
  ],
  eslintOptions: {
    dirs: [],
    ignorePatterns: ['**'],
  },
  tsconfig: {
    compilerOptions: {
      lib: ['dom'],
    },
  },
  gitignore: ['.DS_Store', '.dccache'],
  releaseToNpm: true,
});

project.synth();