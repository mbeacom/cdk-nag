/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnRole, CfnUser, CfnGroup } from '@aws-cdk/aws-iam';
import { CfnResource, Stack } from '@aws-cdk/core';

/**
 * IAM users, roles, and groups do not use AWS managed policies
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (
    node instanceof CfnGroup ||
    node instanceof CfnUser ||
    node instanceof CfnRole
  ) {
    const managedPolicyArns = Stack.of(node).resolve(node.managedPolicyArns);
    if (managedPolicyArns != undefined) {
      for (const arn of managedPolicyArns) {
        const resolvedArn = Stack.of(node).resolve(arn);
        const arnPrefix = JSON.stringify(resolvedArn).split('/', 1)[0];
        if (
          !(/\d{12}/.test(arnPrefix) || arnPrefix.includes('AWS::AccountId'))
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
