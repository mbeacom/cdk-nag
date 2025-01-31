/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnReplicationGroup } from '@aws-cdk/aws-elasticache';
import { CfnResource } from '@aws-cdk/core';
import { resolveIfPrimitive } from '../../../nag-pack';

/**
 * ElastiCache Redis clusters are deployed in a Multi-AZ configuration
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnReplicationGroup) {
    if (node.multiAzEnabled == undefined) {
      return false;
    }
    const multiAz = resolveIfPrimitive(node, node.multiAzEnabled);
    if (!multiAz) {
      return false;
    }
  }
  return true;
}
