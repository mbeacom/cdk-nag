/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnCacheCluster, CfnReplicationGroup } from '@aws-cdk/aws-elasticache';
import { CfnResource } from '@aws-cdk/core';

/**
 * ElastiCache clusters are provisioned in a VPC
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnCacheCluster || node instanceof CfnReplicationGroup) {
    if (
      node.cacheSubnetGroupName == undefined ||
      node.cacheSubnetGroupName.length == 0
    ) {
      return false;
    }
  }
  return true;
}
