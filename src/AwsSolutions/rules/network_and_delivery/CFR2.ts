/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnDistribution } from '@aws-cdk/aws-cloudfront';
import { CfnResource, Stack } from '@aws-cdk/core';

/**
 * CloudFront distributions may require integration with AWS WAF
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnDistribution) {
    const distributionConfig = Stack.of(node).resolve(node.distributionConfig);
    if (distributionConfig.webAclId == undefined) {
      return false;
    }
  }
  return true;
}
