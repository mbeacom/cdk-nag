/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

import { SynthUtils } from '@aws-cdk/assert';
import { CfnProject } from '@aws-cdk/aws-codebuild';
import { Aspects, Stack } from '@aws-cdk/core';
import { HIPAASecurityChecks } from '../../src';

describe('Amazon CodeBuild', () => {
  test('hipaaSecurityCodeBuildProjectEnvVarAwsCred: - CodeBuild projects do not store AWS credentials as plaintext environment variables - (Control IDs: 164.308(a)(3)(i), 164.308(a)(4)(ii)(A), 164.308(a)(4)(ii)(C), 164.312(a)(1))', () => {
    const nonCompliant = new Stack();
    Aspects.of(nonCompliant).add(new HIPAASecurityChecks());
    new CfnProject(nonCompliant, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'AWS_ACCESS_KEY_ID',
            type: 'PLAINTEXT',
            value: 'myawsaccesskeyid',
          },
        ],
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    const messages = SynthUtils.synthesize(nonCompliant).messages;
    expect(messages).toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectEnvVarAwsCred:'
          ),
        }),
      })
    );

    const nonCompliant2 = new Stack();
    Aspects.of(nonCompliant2).add(new HIPAASecurityChecks());
    new CfnProject(nonCompliant2, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'AWS_ACCESS_KEY_ID',
            value: 'myawsaccesskeyid',
          },
        ],
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    const messages2 = SynthUtils.synthesize(nonCompliant2).messages;
    expect(messages2).toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectEnvVarAwsCred:'
          ),
        }),
      })
    );

    const nonCompliant3 = new Stack();
    Aspects.of(nonCompliant3).add(new HIPAASecurityChecks());
    new CfnProject(nonCompliant3, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            value: 'myawsaccesskeyid',
          },
        ],
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    const messages3 = SynthUtils.synthesize(nonCompliant3).messages;
    expect(messages3).toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectEnvVarAwsCred:'
          ),
        }),
      })
    );

    const compliant = new Stack();
    Aspects.of(compliant).add(new HIPAASecurityChecks());
    new CfnProject(compliant, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    new CfnProject(compliant, 'rProject2', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'AWS_ACCESS_KEY_ID',
            type: 'PARAMETER_STORE',
            value: 'myawsaccesskeyid',
          },
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            type: 'PARAMETER_STORE',
            value: 'myawssecretaccesskey',
          },
        ],
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    new CfnProject(compliant, 'rProject3', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
        environmentVariables: [
          {
            name: 'AWS_ACCESS_KEY_ID',
            type: 'SECRETS_MANAGER',
            value: 'myawsaccesskeyid',
          },
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            type: 'SECRETS_MANAGER',
            value: 'myawssecretaccesskey',
          },
        ],
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    const messages4 = SynthUtils.synthesize(compliant).messages;
    expect(messages4).not.toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectEnvVarAwsCred:'
          ),
        }),
      })
    );
  });

  test('hipaaSecurityCodeBuildProjectSourceRepoUrl: - Codebuild projects with a GitHub or BitBucket source repository utilize OAUTH - (Control IDs: 164.308(a)(3)(i), 164.308(a)(4)(ii)(A), 164.308(a)(4)(ii)(C), 164.312(a)(1))', () => {
    const nonCompliant = new Stack();
    Aspects.of(nonCompliant).add(new HIPAASecurityChecks());
    new CfnProject(nonCompliant, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
      },
    });

    const messages = SynthUtils.synthesize(nonCompliant).messages;
    expect(messages).toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectSourceRepoUrl:'
          ),
        }),
      })
    );

    const compliant = new Stack();
    Aspects.of(compliant).add(new HIPAASecurityChecks());
    new CfnProject(compliant, 'rProject1', {
      artifacts: {
        type: 'no_artifacts',
      },
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        image: 'aws/CodeBuild/standard:4.0',
        type: 'LINUX_CONTAINER',
      },
      serviceRole: 'someservicerole',
      source: {
        type: 'NO_SOURCE',
        auth: {
          type: 'OAUTH',
        },
      },
    });

    const messages6 = SynthUtils.synthesize(compliant).messages;
    expect(messages6).not.toContainEqual(
      expect.objectContaining({
        entry: expect.objectContaining({
          data: expect.stringContaining(
            'HIPAA.Security-CodeBuildProjectSourceRepoUrl:'
          ),
        }),
      })
    );
  });
});
