/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnNotebookInstance } from '@aws-cdk/aws-sagemaker';
import { CfnResource, Stack } from '@aws-cdk/core';

/**
 * SageMaker notebook instances are provisioned inside a VPC
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnNotebookInstance) {
    const subnetId = Stack.of(node).resolve(node.subnetId);
    if (subnetId == undefined) {
      return false;
    }
  }
  return true;
}
