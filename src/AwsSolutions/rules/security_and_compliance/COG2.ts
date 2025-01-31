/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnUserPool, Mfa } from '@aws-cdk/aws-cognito';
import { CfnResource } from '@aws-cdk/core';
import { resolveIfPrimitive } from '../../../nag-pack';

/**
 * Cognito user pools require MFA
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnUserPool) {
    const mfaConfiguration = resolveIfPrimitive(node, node.mfaConfiguration);
    if (mfaConfiguration == undefined || mfaConfiguration != Mfa.REQUIRED) {
      return false;
    }
  }
  return true;
}
