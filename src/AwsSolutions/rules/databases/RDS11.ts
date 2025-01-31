/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { CfnDBCluster, CfnDBInstance } from '@aws-cdk/aws-rds';
import { CfnResource } from '@aws-cdk/core';
import { resolveIfPrimitive } from '../../../nag-pack';

/**
 *  RDS DB instances and Aurora DB clusters do not use the default endpoint ports
 * @param node the CfnResource to check
 */
export default function (node: CfnResource): boolean {
  if (node instanceof CfnDBCluster) {
    if (node.port == undefined) {
      return false;
    }
    const port = resolveIfPrimitive(node, node.port);
    const engine = resolveIfPrimitive(node, node.engine).toLowerCase();
    const engineMode = resolveIfPrimitive(node, node.engineMode);
    if (engineMode == undefined || engineMode.toLowerCase() == 'provisioned') {
      if (engine.includes('aurora') && port == 3306) {
        return false;
      }
    } else if (
      (engine == 'aurora' || engine == 'aurora-mysql') &&
      port == 3306
    ) {
      return false;
    } else if (engine == 'aurora-postgresql' && port == 5432) {
      return false;
    }
    return true;
  } else if (node instanceof CfnDBInstance) {
    if (node.engine == undefined) {
      return false;
    }
    const port = resolveIfPrimitive(node, node.port);
    const engine = resolveIfPrimitive(node, node.engine).toLowerCase();
    if (port == undefined) {
      if (!engine.includes('aurora')) {
        return false;
      }
    } else {
      if ((engine == 'mariadb' || engine == 'mysql') && port == 3306) {
        return false;
      } else if (engine == 'postgres' && port == 5432) {
        return false;
      } else if (engine.includes('oracle') && port == 1521) {
        return false;
      } else if (engine.includes('sqlserver') && port == 1433) {
        return false;
      }
    }
    return true;
  }
  return true;
}
