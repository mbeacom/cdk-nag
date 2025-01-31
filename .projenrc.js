/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
const {
  AwsCdkConstructLibrary,
  DependenciesUpgradeMechanism,
} = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Arun Donti',
  authorAddress: 'donti@amazon.com',
  cdkVersion: '1.123.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-nag',
  description:
    'Check CDK applications for best practices using a combination on available rule packs.',
  repositoryUrl: 'https://github.com/cdklabs/cdk-nag.git',

  cdkDependencies: [
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-authorizers',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-athena',
    '@aws-cdk/aws-autoscaling',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-cloud9',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-cloudtrail',
    '@aws-cdk/aws-cloudwatch',
    '@aws-cdk/aws-cloudwatch-actions',
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-dax',
    '@aws-cdk/aws-dms',
    '@aws-cdk/aws-docdb',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-efs',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-elasticache',
    '@aws-cdk/aws-elasticbeanstalk',
    '@aws-cdk/aws-elasticloadbalancing',
    '@aws-cdk/aws-elasticloadbalancingv2',
    '@aws-cdk/aws-elasticsearch',
    '@aws-cdk/aws-emr',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-kinesis',
    '@aws-cdk/aws-kinesisanalytics',
    '@aws-cdk/aws-kinesisfirehose',
    '@aws-cdk/aws-kms',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-logs',
    '@aws-cdk/aws-mediastore',
    '@aws-cdk/aws-msk',
    '@aws-cdk/aws-neptune',
    '@aws-cdk/aws-opensearchservice',
    '@aws-cdk/aws-quicksight',
    '@aws-cdk/aws-rds',
    '@aws-cdk/aws-redshift',
    '@aws-cdk/aws-sagemaker',
    '@aws-cdk/aws-secretsmanager',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-sqs',
    '@aws-cdk/aws-stepfunctions',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-wafv2',
    '@aws-cdk/core',
  ],
  pullRequestTemplateContents: [
    '',
    '----',
    '',
    '*By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license*',
  ],
  eslintOptions: { prettier: true },
  publishToPypi: {
    distName: 'cdk-nag',
    module: 'cdk_nag',
  },
  projenUpgradeSecret: 'CDK_AUTOMATION_GITHUB_TOKEN',
  autoApproveOptions: {
    allowedUsernames: ['dontirun'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve'],
      secret: 'CDK_AUTOMATION_GITHUB_TOKEN',
      container: {
        image: 'jsii/superchain:1-buster-slim-node12',
      },
    },
  },
  buildWorkflow: true,
  release: true,
});
project.package.addField('resolutions', {
  'ansi-regex': '^5.0.1',
});
project.package.addField('prettier', {
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
});
project.eslint.addRules({
  'prettier/prettier': [
    'error',
    { singleQuote: true, semi: true, trailingComma: 'es5' },
  ],
});
project.buildWorkflow.file.addOverride('jobs.build.steps', [
  {
    name: 'Checkout',
    uses: 'actions/checkout@v2',
    with: {
      ref: '${{ github.event.pull_request.head.ref }}',
      repository: '${{ github.event.pull_request.head.repo.full_name }}',
    },
  },
  {
    name: 'Setup Node.js',
    uses: 'actions/setup-node@v2.2.0',
    with: { 'node-version': '12.20.0' },
  },
  {
    name: 'Install dependencies',
    run: 'yarn install --check-files --frozen-lockfile',
  },
  {
    name: 'Set git identity',
    run: 'git config user.name "Automation"\ngit config user.email "github-actions@github.com"',
  },
  {
    name: 'Build for cdk',
    run: 'npx projen build',
  },
  {
    name: 'Check for changes',
    id: 'git_diff',
    run: 'git diff --exit-code || echo "::set-output name=has_changes::true"',
  },
  {
    if: 'steps.git_diff.outputs.has_changes',
    name: 'Commit and push changes (if changed)',
    run: 'git add .\ngit commit -m "chore: self mutation"\ngit push origin HEAD:${{ github.event.pull_request.head.ref }}',
  },
  {
    if: 'steps.git_diff.outputs.has_changes',
    name: 'Update status check (if changed)',
    run: 'gh api -X POST /repos/${{ github.event.pull_request.head.repo.full_name }}/check-runs -F name="build" -F head_sha="$(git rev-parse HEAD)" -F status="completed" -F conclusion="success"',
    env: {
      GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  },
  {
    if: 'steps.git_diff.outputs.has_changes',
    name: 'Cancel workflow (if changed)',
    run: 'gh api -X POST /repos/${{ github.event.pull_request.head.repo.full_name }}/actions/runs/${{ github.run_id }}/cancel',
    env: {
      GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  },
  {
    name: 'Setup for monocdk build',
    run: "rm yarn.lock\nrm .projenrc.js\nmv .projenrc.monocdk.js .projenrc.js\nfind ./src -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'\nfind ./test -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'\nfind ./src -type f | xargs sed -i  's,@aws-cdk,monocdk,g'\nfind ./test -type f | xargs sed -i  's,@aws-cdk,monocdk,g'\nfind ./test -type f | xargs sed -i  's,monocdk/assert,@monocdk-experiment/assert,g'",
  },
  {
    name: 'Build for monocdk',
    run: 'npx projen build',
    env: {
      GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  },
]);
project.buildWorkflow.file.addOverride('jobs.build.container', {
  image: 'jsii/superchain:1-buster-slim-node12',
});
project.release.addJobs({
  release: {
    runsOn: 'ubuntu-latest',
    permissions: {
      contents: 'write',
    },
    outputs: {
      latest_commit: { stepId: 'git_remote', outputName: 'latest_commit' },
    },
    env: {
      CI: 'true',
      RELEASE: 'true',
    },
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v2',
        with: {
          'fetch-depth': 0,
        },
      },
      {
        name: 'Set git identity',
        run: 'git config user.name "Automation"\ngit config user.email "github-actions@github.com"',
      },
      {
        name: 'Setup Node.js',
        uses: 'actions/setup-node@v2.2.0',
        with: { 'node-version': '12.20.0' },
      },
      {
        name: 'Install dependencies',
        run: 'yarn install --check-files --frozen-lockfile',
      },
      {
        name: 'Bump to next version',
        run: 'npx projen bump',
      },
      {
        name: 'build',
        run: 'npx projen build',
      },
      {
        name: 'remove changelog',
        run: 'rm dist/changelog.md',
      },
      {
        name: 'Unbump',
        run: 'npx projen unbump',
      },
      {
        name: 'Anti-tamper check',
        run: 'git diff --ignore-space-at-eol --exit-code',
      },
      {
        name: 'Setup for monocdk build',
        run: "rm yarn.lock\nrm .projenrc.js\nmv .projenrc.monocdk.js .projenrc.js\nfind ./src -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'\nfind ./test -type f | xargs sed -i  's,@aws-cdk/core,monocdk,g'\nfind ./src -type f | xargs sed -i  's,@aws-cdk,monocdk,g'\nfind ./test -type f | xargs sed -i  's,@aws-cdk,monocdk,g'\nfind ./test -type f | xargs sed -i  's,monocdk/assert,@monocdk-experiment/assert,g'",
      },
      {
        name: 'Bump to next version',
        run: 'npx projen bump',
      },
      {
        name: 'Build for monocdk',
        run: 'npx projen build',
      },
      {
        name: 'Unbump',
        run: 'npx projen unbump',
      },
      {
        name: 'Check for new commits',
        id: 'git_remote',
        run: 'echo ::set-output name=latest_commit::"$(git ls-remote origin -h ${{ github.ref }} | cut -f1)"',
      },
      {
        name: 'Upload artifact',
        if: '${{ steps.git_remote.outputs.latest_commit == github.sha }}',
        uses: 'actions/upload-artifact@v2.1.1',
        with: {
          name: 'dist',
          path: 'dist',
        },
      },
    ],
    container: {
      image: 'jsii/superchain:1-buster-slim-node12',
    },
  },
});

project.synth();
