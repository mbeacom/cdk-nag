/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

import { CfnResource, IConstruct } from '@aws-cdk/core';
import { NagMessageLevel, NagPack } from '../nag-pack';
import {
  nist80053r5APIGWCacheEnabledAndEncrypted,
  nist80053r5APIGWExecutionLoggingEnabled,
  nist80053r5APIGWSSLEnabled,
} from './rules/apigw';
import {
  nist80053r5AutoscalingGroupELBHealthCheckRequired,
  nist80053r5AutoscalingLaunchConfigPublicIpDisabled,
} from './rules/autoscaling';
import {
  nist80053r5CloudTrailCloudWatchLogsEnabled,
  nist80053r5CloudTrailEncryptionEnabled,
  nist80053r5CloudTrailLogFileValidationEnabled,
} from './rules/cloudtrail';
import {
  nist80053r5CloudWatchAlarmAction,
  nist80053r5CloudWatchLogGroupEncrypted,
  nist80053r5CloudWatchLogGroupRetentionPeriod,
} from './rules/cloudwatch';
import { nist80053r5DMSReplicationNotPublic } from './rules/dms';
import { nist80053r5DynamoDBPITREnabled } from './rules/dynamodb';
import {
  nist80053r5EC2EBSOptimizedInstance,
  nist80053r5EC2InstanceNoPublicIp,
  nist80053r5EC2InstanceProfileAttached,
  nist80053r5EC2InstancesInVPC,
  nist80053r5EC2RestrictedCommonPorts,
  nist80053r5EC2RestrictedSSH,
} from './rules/ec2';
import { nist80053r5ECSTaskDefinitionUserForHostMode } from './rules/ecs';
import { nist80053r5EFSEncrypted } from './rules/efs';
import { nist80053r5ElastiCacheRedisClusterAutomaticBackup } from './rules/elasticache';
import {
  nist80053r5ElasticBeanstalkEnhancedHealthReportingEnabled,
  nist80053r5ElasticBeanstalkManagedUpdatesEnabled,
} from './rules/elasticbeanstalk';
import {
  nist80053r5ALBHttpToHttpsRedirection,
  nist80053r5ELBACMCertificateRequired,
  nist80053r5ELBCrossZoneLoadBalancingEnabled,
  nist80053r5ELBDeletionProtectionEnabled,
  nist80053r5ELBLoggingEnabled,
  nist80053r5ELBTlsHttpsListenersOnly,
  nist80053r5ELBv2ACMCertificateRequired,
} from './rules/elb';
import {
  nist80053r5IAMNoInlinePolicy,
  nist80053r5IAMPolicyNoStatementsWithAdminAccess,
  nist80053r5IAMPolicyNoStatementsWithFullAccess,
  nist80053r5IAMUserGroupMembership,
  nist80053r5IAMUserNoPolicies,
} from './rules/iam';
import {
  nist80053r5LambdaConcurrency,
  nist80053r5LambdaDlq,
  nist80053r5LambdaInsideVPC,
} from './rules/lambda';
import {
  nist80053r5OpenSearchEncryptedAtRest,
  nist80053r5OpenSearchInVPCOnly,
  nist80053r5OpenSearchLogsToCloudWatch,
  nist80053r5OpenSearchNodeToNodeEncryption,
} from './rules/opensearch';
import {
  nist80053r5RDSEnhancedMonitoringEnabled,
  nist80053r5RDSInstanceBackupEnabled,
  nist80053r5RDSInstanceDeletionProtectionEnabled,
  nist80053r5RDSInstancePublicAccess,
  nist80053r5RDSLoggingEnabled,
  nist80053r5RDSMultiAZSupport,
  nist80053r5RDSStorageEncrypted,
} from './rules/rds';
import {
  nist80053r5RedshiftBackupEnabled,
  nist80053r5RedshiftClusterConfiguration,
  nist80053r5RedshiftClusterMaintenanceSettings,
  nist80053r5RedshiftClusterPublicAccess,
  nist80053r5RedshiftEnhancedVPCRoutingEnabled,
} from './rules/redshift';
import {
  nist80053r5S3BucketLevelPublicAccessProhibited,
  nist80053r5S3BucketLoggingEnabled,
  nist80053r5S3BucketPublicReadProhibited,
  nist80053r5S3BucketPublicWriteProhibited,
  nist80053r5S3BucketReplicationEnabled,
  nist80053r5S3BucketServerSideEncryptionEnabled,
  nist80053r5S3BucketVersioningEnabled,
  nist80053r5S3DefaultEncryptionKMS,
} from './rules/s3';
import {
  nist80053r5SageMakerEndpointConfigurationKMSKeyConfigured,
  nist80053r5SageMakerNotebookInstanceKMSKeyConfigured,
  nist80053r5SageMakerNotebookNoDirectInternetAccess,
} from './rules/sagemaker';
import { nist80053r5SecretsManagerUsingKMSKey } from './rules/secretsmanager';
import { nist80053r5SNSEncryptedKMS } from './rules/sns';
import {
  nist80053r5VPCDefaultSecurityGroupClosed,
  nist80053r5VPCNoUnrestrictedRouteToIGW,
  nist80053r5VPCSubnetAutoAssignPublicIpDisabled,
} from './rules/vpc';

/**
 * Check for NIST 800-53 rev 5 compliance.
 * Based on the NIST 800-53 rev 5 AWS operational best practices: https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-nist-800-53_rev_5.html
 */
export class NIST80053R5Checks extends NagPack {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      this.checkAPIGW(node);
      this.checkAutoScaling(node);
      this.checkCloudTrail(node);
      this.checkCloudWatch(node);
      this.checkDMS(node);
      this.checkDynamoDB(node);
      this.checkEC2(node);
      this.checkECS(node);
      this.checkEFS(node);
      this.checkElastiCache(node);
      this.checkElasticBeanstalk(node);
      this.checkELB(node);
      this.checkIAM(node);
      this.checkLambda(node);
      this.checkOpenSearch(node);
      this.checkRDS(node);
      this.checkRedshift(node);
      this.checkS3(node);
      this.checkSageMaker(node);
      this.checkSecretsManager(node);
      this.checkSNS(node);
      this.checkVPC(node);
    }
  }

  /**
   * Check API Gateway Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkAPIGW(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-APIGWCacheEnabledAndEncrypted',
      info: 'The API Gateway stage does not have caching enabled and encrypted for all methods - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        "To help protect data at rest, ensure encryption is enabled for your API Gateway stage's cache. Because sensitive data can be captured for the API method, enable encryption at rest to help protect that data.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r5APIGWCacheEnabledAndEncrypted,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-APIGWExecutionLoggingEnabled',
      info: 'The API Gateway stage does not have execution logging enabled for all methods - (Control IDs: AC-4(26), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-8b, AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), CA-7b, CM-5(1)(b), IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SI-4(17), SI-7(8)).',
      explanation:
        'API Gateway logging displays detailed views of users who accessed the API and the way they accessed the API. This insight enables visibility of user activities.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5APIGWExecutionLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-APIGWSSLEnabled',
      info: 'The API Gateway REST API stage is not configured with SSL certificates - (Control IDs: AC-4, AC-4(22), AC-17(2), AC-24(1), AU-9(3), CA-9b, IA-5(1)(c), PM-17b, SC-7(4)(b), SC-7(4)(g), SC-8, SC-8(1), SC-8(2), SC-8(3), SC-8(4), SC-8(5), SC-13a, SC-23, SI-1a.2, SI-1a.2, SI-1c.2).',
      explanation:
        'Ensure Amazon API Gateway REST API stages are configured with SSL certificates to allow backend systems to authenticate that requests originate from API Gateway.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5APIGWSSLEnabled,
      node: node,
    });
  }

  /**
   * Check Auto Scaling Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkAutoScaling(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-AutoscalingGroupELBHealthCheckRequired',
      info: 'The Auto Scaling group (which is associated with a load balancer) does not utilize ELB healthchecks - (Control IDs: AU-12(3), AU-14a, AU-14b, CA-2(2), CA-7, CA-7b, CM-6a, CM-9b, PM-14a.1, PM-14b, PM-31, SC-6, SC-36(1)(a), SI-2a).',
      explanation:
        'The Elastic Load Balancer (ELB) health checks for Amazon Elastic Compute Cloud (Amazon EC2) Auto Scaling groups support maintenance of adequate capacity and availability. The load balancer periodically sends pings, attempts connections, or sends requests to test Amazon EC2 instances health in an auto-scaling group. If an instance is not reporting back, traffic is sent to a new Amazon EC2 instance.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5AutoscalingGroupELBHealthCheckRequired,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-AutoscalingLaunchConfigPublicIpDisabled',
      info: 'The Auto Scaling launch configuration does not have public IP addresses disabled - (Control IDs: AC-3, AC-4(21), CM-6a, SC-7(3)).',
      explanation:
        'If you configure your Network Interfaces with a public IP address, then the associated resources to those Network Interfaces are reachable from the internet. EC2 resources should not be publicly accessible, as this may allow unintended access to your applications or servers.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5AutoscalingLaunchConfigPublicIpDisabled,
      node: node,
    });
  }

  /**
   * Check CloudTrail Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkCloudTrail(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudTrailCloudWatchLogsEnabled',
      info: 'The trail does not have CloudWatch logs enabled - (Control IDs: AC-2(4), AC-3(1), AC-3(10), AC-4(26), AC-6(9), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-4(1), AU-6(1), AU-6(3), AU-6(4), AU-6(5), AU-6(6), AU-6(9), AU-7(1), AU-8b, AU-9(7), AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), AU-16, CA-7b, CM-5(1)(b), CM-6a, CM-9b, IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SI-1(1)(c), SI-3(8)(b), SI-4(2), SI-4(17), SI-4(20), SI-7(8), SI-10(1)(c)).',
      explanation:
        'Use Amazon CloudWatch to centrally collect and manage log event activity. Inclusion of AWS CloudTrail data provides details of API call activity within your AWS account.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudTrailCloudWatchLogsEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudTrailEncryptionEnabled',
      info: 'The trail does not have encryption enabled - (Control IDs: AU-9(3), CM-6a, CM-9b, CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data may exist and to help protect data at rest, ensure encryption is enabled for your AWS CloudTrail trails.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudTrailEncryptionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudTrailLogFileValidationEnabled',
      info: 'The trail does not have log file validation enabled - (Control IDs: AU-9a, CM-6a, CM-9b, PM-11b, PM-17b, SA-1(1), SA-10(1), SC-16(1), SI-1a.2, SI-1a.2, SI-1c.2, SI-4d, SI-7a, SI-7(1), SI-7(3), SI-7(7)).',
      explanation:
        'Utilize AWS CloudTrail log file validation to check the integrity of CloudTrail logs. Log file validation helps determine if a log file was modified or deleted or unchanged after CloudTrail delivered it. This feature is built using industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing. This makes it computationally infeasible to modify, delete or forge CloudTrail log files without detection.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudTrailLogFileValidationEnabled,
      node: node,
    });
  }

  /**
   * Check CloudWatch Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkCloudWatch(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudWatchAlarmAction',
      info: 'The CloudWatch alarm does not have at least one alarm action, one INSUFFICIENT_DATA action, or one OK action enabled - (Control IDs: AU-6(1), AU-6(5), AU-12(3), AU-14a, AU-14b, CA-2(2), CA-7, CA-7b, PM-14a.1, PM-14b, PM-31, SC-36(1)(a), SI-2a, SI-4(12), SI-5b, SI-5(1)).',
      explanation:
        'Amazon CloudWatch alarms alert when a metric breaches the threshold for a specified number of evaluation periods. The alarm performs one or more actions based on the value of the metric or expression relative to a threshold over a number of time periods.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudWatchAlarmAction,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudWatchLogGroupEncrypted',
      info: 'The CloudWatch Log Group is not encrypted with an AWS KMS key - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'To help protect sensitive data at rest, ensure encryption is enabled for your Amazon CloudWatch Log Groups.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudWatchLogGroupEncrypted,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-CloudWatchLogGroupRetentionPeriod',
      info: 'The CloudWatch Log Group does not have an explicit retention period configured - (Control IDs: AC-16b, AT-4b, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-10, AU-11(1), AU-11, AU-12(1), AU-12(2), AU-12(3), AU-14a, AU-14b, CA-7b, PM-14a.1, PM-14b, PM-21b, PM-31, SC-28(2), SI-4(17), SI-12).',
      explanation:
        'Ensure a minimum duration of event log data is retained for your log groups to help with troubleshooting and forensics investigations. The lack of available past event log data makes it difficult to reconstruct and identify potentially malicious events.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5CloudWatchLogGroupRetentionPeriod,
      node: node,
    });
  }

  /**
   * Check DMS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkDMS(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-DMSReplicationNotPublic',
      info: 'The DMS replication instance is public - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'DMS replication instances can contain sensitive information and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5DMSReplicationNotPublic,
      node: node,
    });
  }

  /**
   * Check DynamoDB Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkDynamoDB(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-DynamoDBPITREnabled',
      info: 'The DynamoDB table does not have Point-in-time Recovery enabled - (Control IDs: CP-1(2), CP-2(5), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), SC-5(2), SI-13(5)).',
      explanation:
        'The recovery maintains continuous backups of your table for the last 35 days.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5DynamoDBPITREnabled,
      node: node,
    });
  }

  /**
   * Check EC2 Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkEC2(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2EBSOptimizedInstance',
      info: "The EC2 instance type 'supports' EBS optimization and does not have EBS optimization enabled - (Control IDs: CP-2(5), CP-9a, CP-9b, CP-9c, CP-10, SC-5(2)).",
      explanation:
        'An optimized instance in Amazon Elastic Block Store (Amazon EBS) provides additional, dedicated capacity for Amazon EBS I/O operations. This optimization provides the most efficient performance for your EBS volumes by minimizing contention between Amazon EBS I/O operations and other traffic from your instance.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2EBSOptimizedInstance,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2InstanceNoPublicIp',
      info: 'The EC2 instance is associated with a public IP address - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'Manage access to the AWS Cloud by ensuring Amazon Elastic Compute Cloud (Amazon EC2) instances cannot be publicly accessed. Amazon EC2 instances can contain sensitive information and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2InstanceNoPublicIp,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2InstanceProfileAttached',
      info: 'The EC2 instance does not have an instance profile attached - (Control IDs: AC-3, CM-5(1)(a), CM-6a).',
      explanation:
        'EC2 instance profiles pass an IAM role to an EC2 instance. Attaching an instance profile to your instances can assist with least privilege and permissions management.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2InstanceProfileAttached,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2InstancesInVPC',
      info: 'The EC2 instance is not within a VPC - (Control IDs: AC-2(6), AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-25).',
      explanation:
        'Deploy Amazon Elastic Compute Cloud (Amazon EC2) instances within an Amazon Virtual Private Cloud (Amazon VPC) to enable secure communication between an instance and other services within the amazon VPC, without requiring an internet gateway, NAT device, or VPN connection. All traffic remains securely within the AWS Cloud. Because of their logical isolation, domains that reside within anAmazon VPC have an extra layer of security when compared to domains that use public endpoints. Assign Amazon EC2 instances to an Amazon VPC to properly manage access.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2InstancesInVPC,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2RestrictedCommonPorts',
      info: 'The EC2 instance allows unrestricted inbound IPv4 TCP traffic on one or more common ports (by default these ports include 20, 21, 3389, 3309, 3306, 4333) - (Control IDs: AC-4(21), AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), CM-2a, CM-2(2), CM-6a, CM-7b, CM-8(6), CM-9b, SC-7a, SC-7c, SC-7(5), SC-7(7), SC-7(11), SC-7(12), SC-7(16), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28)).',
      explanation:
        'Not restricting access to ports to trusted sources can lead to attacks against the availability, integrity and confidentiality of systems. By default, common ports which should be restricted include port numbers 20, 21, 3389, 3306, and 4333.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2RestrictedCommonPorts,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EC2RestrictedSSH',
      info: 'The Security Group allows unrestricted SSH access - (Control IDs: AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), CM-9b, SC-7a, SC-7c, SC-7(7), SC-7(11), SC-7(12), SC-7(16), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28)).',
      explanation:
        'Not allowing ingress (or remote) traffic from 0.0.0.0/0 or ::/0 to port 22 on your resources helps to restrict remote access.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EC2RestrictedSSH,
      node: node,
    });
  }

  /**
   * Check ECS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkECS(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ECSTaskDefinitionUserForHostMode',
      info: "The ECS task definition is configured for host networking and has at least one container with definitions with 'privileged' set to false or empty or 'user' set to root or empty - (Control IDs: AC-3, AC-5b, CM-5(1)(a)).",
      explanation:
        'If a task definition has elevated privileges it is because you have specifically opted-in to those configurations. This rule checks for unexpected privilege escalation when a task definition has host networking enabled but the customer has not opted-in to elevated privileges.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ECSTaskDefinitionUserForHostMode,
      node: node,
    });
  }

  /**
   * Check EFS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkEFS(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-EFSEncrypted',
      info: 'The EFS does not have encryption at rest enabled - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist and to help protect data at rest, ensure encryption is enabled for your Amazon Elastic File System (EFS).',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5EFSEncrypted,
      node: node,
    });
  }

  /**
   * Check ElastiCache Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkElastiCache(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ElastiCacheRedisClusterAutomaticBackup',
      info: 'The ElastiCache Redis cluster does not retain automatic backups for at least 15 days - (Control IDs: CP-1(2), CP-2(5), CP-6a, CP-6(1), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), SC-5(2), SI-13(5)).',
      explanation:
        'Automatic backups can help guard against data loss. If a failure occurs, you can create a new cluster, which restores your data from the most recent backup.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ElastiCacheRedisClusterAutomaticBackup,
      node: node,
    });
  }

  /**
   * Check Elastic Beanstalk Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkElasticBeanstalk(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ElasticBeanstalkEnhancedHealthReportingEnabled',
      info: 'The Elastic Beanstalk environment does not have enhanced health reporting enabled - (Control IDs: AU-12(3), AU-14a, AU-14b, CA-2(2), CA-7, CA-7b, PM-14a.1, PM-14b, PM-31, SC-6, SC-36(1)(a), SI-2a).',
      explanation:
        'AWS Elastic Beanstalk enhanced health reporting enables a more rapid response to changes in the health of the underlying infrastructure. These changes could result in a lack of availability of the application. Elastic Beanstalk enhanced health reporting provides a status descriptor to gauge the severity of the identified issues and identify possible causes to investigate.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ElasticBeanstalkEnhancedHealthReportingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ElasticBeanstalkManagedUpdatesEnabled',
      info: 'The Elastic Beanstalk environment does not have managed updates enabled - (Control IDs: SI-2c, SI-2d, SI-2(2), SI-2(5)).',
      explanation:
        'Enabling managed platform updates for an Amazon Elastic Beanstalk environment ensures that the latest available platform fixes, updates, and features for the environment are installed. Keeping up to date with patch installation is a best practice in securing systems.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ElasticBeanstalkManagedUpdatesEnabled,
      node: node,
    });
  }

  /**
   * Check Elastic Load Balancer Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkELB(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ALBHttpToHttpsRedirection',
      info: "The ALB's HTTP listeners are not configured to redirect to HTTPS - (Control IDs: AC-4, AC-4(22), AC-17(2), AC-24(1), AU-9(3), CA-9b, IA-5(1)(c), PM-17b, SC-7(4)(b), SC-7(4)(g), SC-8, SC-8(1), SC-8(2), SC-8(3), SC-8(4), SC-8(5), SC-13a, SC-23, SI-1a.2, SI-1a.2, SI-1c.2).",
      explanation:
        'To help protect data in transit, ensure that your Application Load Balancer automatically redirects unencrypted HTTP requests to HTTPS. Because sensitive data can exist, enable encryption in transit to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ALBHttpToHttpsRedirection,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBACMCertificateRequired',
      info: 'The CLB does not utilize an SSL certificate provided by ACM (Amazon Certificate Manager) - (Control IDs: AC-4, AC-4(22), AC-17(2), AC-24(1), AU-9(3), CA-9b, IA-5(1)(c), PM-17b, SC-7(4)(b), SC-7(4)(g), SC-8, SC-8(1), SC-8(2), SC-8(3), SC-8(4), SC-8(5), SC-13a, SC-23, SC-23(5), SI-1a.2, SI-1a.2, SI-1c.2).',
      explanation:
        'Because sensitive data can exist and to help protect data at transit, ensure encryption is enabled for your Elastic Load Balancing. Use AWS Certificate Manager to manage, provision and deploy public and private SSL/TLS certificates with AWS services and internal resources.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBACMCertificateRequired,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBCrossZoneLoadBalancingEnabled',
      info: 'The CLB does not balance traffic between at least 2 Availability Zones - (Control IDs: CP-1a.1(b), CP-1a.2, CP-2a, CP-2a.6, CP-2a.7, CP-2d, CP-2e, CP-2(5), CP-2(6), CP-6(2), CP-10, SC-5(2), SC-6, SC-22, SC-36, SI-13(5)).',
      explanation:
        "Enable cross-zone load balancing for your Classic Load Balancers (CLBs) to help maintain adequate capacity and availability. The cross-zone load balancing reduces the need to maintain equivalent numbers of instances in each enabled availability zone. It also improves your application's ability to handle the loss of one or more instances.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBCrossZoneLoadBalancingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBDeletionProtectionEnabled',
      info: 'The ALB, NLB, or GLB does not have deletion protection enabled - (Control IDs: CA-7(4)(c), CM-2a, CM-2(2), CM-3a, CM-8(6), CP-1a.1(b), CP-1a.2, CP-2a, CP-2a.6, CP-2a.7, CP-2d, CP-2e, CP-2(5), SA-15a.4, SC-5(2), SC-22).',
      explanation:
        'This rule ensures that Elastic Load Balancing has deletion protection enabled. Use this feature to prevent your load balancer from being accidentally or maliciously deleted, which can lead to loss of availability for your applications.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBDeletionProtectionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBLoggingEnabled',
      info: 'The ELB does not have logging enabled - (Control IDs: AC-4(26), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-8b, AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), CA-7b, CM-5(1)(b), IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SI-4(17), SI-7(8)).',
      explanation:
        "Elastic Load Balancing activity is a central point of communication within an environment. Ensure ELB logging is enabled. The collected data provides detailed information about requests sent to The ELB. Each log contains information such as the time the request was received, the client's IP address, latencies, request paths, and server responses.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBTlsHttpsListenersOnly',
      info: 'The CLB does not restrict its listeners to only the SSL and HTTPS protocols - (Control IDs: AC-4, AC-4(22), AC-17(2), AC-24(1), AU-9(3), CA-9b, IA-5(1)(c), PM-17b, PM-17b, SC-7(4)(b), SC-7(4)(g), SC-8, SC-8(1), SC-8(2), SC-8(2), SC-8(3), SC-8(4), SC-8(5), SC-13a, SC-23, SI-1a.2, SI-1a.2, SI-1a.2, SI-1a.2, SI-1c.2, SI-1c.2).',
      explanation:
        'Ensure that your Classic Load Balancers (CLBs) are configured with SSL or HTTPS listeners. Because sensitive data can exist, enable encryption in transit to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBTlsHttpsListenersOnly,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-ELBv2ACMCertificateRequired',
      info: 'The ALB, NLB, or GLB listener does not utilize an SSL certificate provided by ACM (Amazon Certificate Manager) - (Control IDs: SC-8(1), SC-23(5)).',
      explanation:
        'Because sensitive data can exist and to help protect data at transit, ensure encryption is enabled for your Elastic Load Balancing. Use AWS Certificate Manager to manage, provision and deploy public and private SSL/TLS certificates with AWS services and internal resources.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5ELBv2ACMCertificateRequired,
      node: node,
    });
  }

  /**
   * Check IAM Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkIAM(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-IAMNoInlinePolicy',
      info: 'The IAM Group, User, or Role contains an inline policy - (Control IDs: AC-2i.2, AC-2(1), AC-2(6), AC-3, AC-3(3)(a), AC-3(3)(b)(1), AC-3(3)(b)(2), AC-3(3)(b)(3), AC-3(3)(b)(4), AC-3(3)(b)(5), AC-3(3)(c), AC-3(3), AC-3(4)(a), AC-3(4)(b), AC-3(4)(c), AC-3(4)(d), AC-3(4)(e), AC-3(4), AC-3(7), AC-3(8), AC-3(12)(a), AC-3(13), AC-3(15)(a), AC-3(15)(b), AC-4(28), AC-6, AC-6(3), AC-24, CM-5(1)(a), CM-6a, CM-9b, MP-2, SC-23(3)).',
      explanation:
        'AWS recommends to use managed policies instead of inline policies. The managed policies allow reusability, versioning and rolling back, and delegating permissions management.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5IAMNoInlinePolicy,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-IAMPolicyNoStatementsWithAdminAccess',
      info: 'The IAM policy grants admin access - (Control IDs: AC-2i.2, AC-2(1), AC-2(6), AC-3, AC-3(3)(a), AC-3(3)(b)(1), AC-3(3)(b)(2), AC-3(3)(b)(3), AC-3(3)(b)(4), AC-3(3)(b)(5), AC-3(3)(c), AC-3(3), AC-3(4)(a), AC-3(4)(b), AC-3(4)(c), AC-3(4)(d), AC-3(4)(e), AC-3(4), AC-3(7), AC-3(8), AC-3(12)(a), AC-3(13), AC-3(15)(a), AC-3(15)(b), AC-4(28), AC-5b, AC-6, AC-6(2), AC-6(3), AC-6(10), AC-24, CM-5(1)(a), CM-6a, CM-9b, MP-2, SC-23(3), SC-25).',
      explanation:
        'AWS Identity and Access Management (IAM) can help you incorporate the principles of least privilege and separation of duties with access permissions and authorizations, by ensuring that IAM groups have at least one IAM user. Placing IAM users in groups based on their associated permissions or job function is one way to incorporate least privilege.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5IAMPolicyNoStatementsWithAdminAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-IAMPolicyNoStatementsWithFullAccess',
      info: 'The IAM policy grants full access - (Control IDs: AC-3, AC-5b, AC-6(2), AC-6(10), CM-5(1)(a)).',
      explanation:
        'Ensure IAM Actions are restricted to only those actions that are needed. Allowing users to have more privileges than needed to complete a task may violate the principle of least privilege and separation of duties.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5IAMPolicyNoStatementsWithFullAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-IAMUserGroupMembership',
      info: 'The IAM user does not belong to any group(s) - (Control IDs: AC-2i.2, AC-2(1), AC-2(6), AC-3, AC-3(3)(a), AC-3(3)(b)(1), AC-3(3)(b)(2), AC-3(3)(b)(3), AC-3(3)(b)(4), AC-3(3)(b)(5), AC-3(3)(c), AC-3(3), AC-3(4)(a), AC-3(4)(b), AC-3(4)(c), AC-3(4)(d), AC-3(4)(e), AC-3(4), AC-3(7), AC-3(8), AC-3(12)(a), AC-3(13), AC-3(15)(a), AC-3(15)(b), AC-4(28), AC-6, AC-6(3), AC-24, CM-5(1)(a), CM-6a, CM-9b, MP-2, SC-23(3)).',
      explanation:
        'AWS Identity and Access Management (IAM) can help you restrict access permissions and authorizations by ensuring IAM users are members of at least one group. Allowing users more privileges than needed to complete a task may violate the principle of least privilege and separation of duties.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5IAMUserGroupMembership,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-IAMUserNoPolicies',
      info: 'The IAM policy is attached at the user level - (Control IDs: AC-2i.2, AC-2(1), AC-2(6), AC-3, AC-3(3)(a), AC-3(3)(b)(1), AC-3(3)(b)(2), AC-3(3)(b)(3), AC-3(3)(b)(4), AC-3(3)(b)(5), AC-3(3)(c), AC-3(3), AC-3(4)(a), AC-3(4)(b), AC-3(4)(c), AC-3(4)(d), AC-3(4)(e), AC-3(4), AC-3(7), AC-3(8), AC-3(12)(a), AC-3(13), AC-3(15)(a), AC-3(15)(b), AC-4(28), AC-6, AC-6(3), AC-24, CM-5(1)(a), CM-6a, CM-9b, MP-2, SC-23(3), SC-25).',
      explanation:
        'Assigning privileges at the group or the role level helps to reduce opportunity for an identity to receive or retain excessive privileges.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5IAMUserNoPolicies,
      node: node,
    });
  }

  /**
   * Check Lambda Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkLambda(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-LambdaConcurrency',
      info: 'The Lambda function is not configured with function-level concurrent execution limits - (Control IDs: AU-12(3), AU-14a, AU-14b, CA-7, CA-7b, PM-14a.1, PM-14b, PM-31, SC-6).',
      explanation:
        "Ensure that a Lambda function's concurrency high and low limits are established. This can assist in baselining the number of requests that your function is serving at any given time.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r5LambdaConcurrency,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-LambdaDlq',
      info: 'The Lambda function is not configured with a dead-letter configuration - (Control IDs: AU-12(3), AU-14a, AU-14b, CA-2(2), CA-7, CA-7b, PM-14a.1, PM-14b, PM-31, SC-36(1)(a), SI-2a).',
      explanation:
        'Notify the appropriate personnel through Amazon Simple Queue Service (Amazon SQS) or Amazon Simple Notification Service (Amazon SNS) when a function has failed.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5LambdaDlq,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-LambdaInsideVPC',
      info: 'The Lambda function is not VPC enabled - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-25).',
      explanation:
        'Because of their logical isolation, domains that reside within an Amazon VPC have an extra layer of security when compared to domains that use public endpoints.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5LambdaInsideVPC,
      node: node,
    });
  }

  /**
   * Check OpenSearch Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkOpenSearch(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-OpenSearchEncryptedAtRest',
      info: 'The OpenSearch Service domain does not have encryption at rest enabled - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist and to help protect data at rest, ensure encryption is enabled for your Amazon OpenSearch Service (OpenSearch Service) domains.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5OpenSearchEncryptedAtRest,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-OpenSearchInVPCOnly',
      info: 'The OpenSearch Service domain is not running within a VPC - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-25).',
      explanation:
        'VPCs help secure your AWS resources and provide an extra layer of protection.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5OpenSearchInVPCOnly,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-OpenSearchLogsToCloudWatch',
      info: 'The OpenSearch Service domain does not stream error logs (ES_APPLICATION_LOGS) to CloudWatch Logs - (Control ID: AU-10).',
      explanation:
        'Ensure Amazon OpenSearch Service domains have error logs enabled and streamed to Amazon CloudWatch Logs for retention and response. Domain error logs can assist with security and access audits, and can help to diagnose availability issues.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5OpenSearchLogsToCloudWatch,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-OpenSearchNodeToNodeEncryption',
      info: 'The OpenSearch Service domain does not have node-to-node encryption enabled - (Control IDs: AC-4, AC-4(22), AC-24(1), AU-9(3), CA-9b, PM-17b, SC-7(4)(b), SC-7(4)(g), SC-8, SC-8(1), SC-8(2), SC-8(3), SC-8(4), SC-8(5), SC-13a, SC-23, SI-1a.2, SI-1a.2, SI-1c.2).',
      explanation:
        'Because sensitive data can exist, enable encryption in transit to help protect that data within your Amazon OpenSearch Service (OpenSearch Service) domains.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5OpenSearchNodeToNodeEncryption,
      node: node,
    });
  }

  /**
   * Check RDS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkRDS(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSEnhancedMonitoringEnabled',
      info: 'The RDS DB Instance does not enhanced monitoring enabled - (Control IDs: AU-12(3), AU-14a, AU-14b, CA-2(2), CA-7, CA-7b, PM-14a.1, PM-14b, PM-31, SC-36(1)(a), SI-2a).',
      explanation:
        'Enable enhanced monitoring to help monitor Amazon RDS availability. This provides detailed visibility into the health of your Amazon RDS database instances.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSEnhancedMonitoringEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSInstanceBackupEnabled',
      info: 'The RDS DB Instance does not have backup enabled - (Control IDs: CP-1(2), CP-2(5), CP-6a, CP-6(1), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), SC-5(2), SI-13(5)).',
      explanation:
        'The backup feature of Amazon RDS creates backups of your databases and transaction logs.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSInstanceBackupEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSInstanceDeletionProtectionEnabled',
      info: 'The RDS DB Instance or Aurora Cluster does not have deletion protection enabled - (Control IDs: CA-7(4)(c), CM-3a, CP-1a.1(b), CP-1a.2, CP-2a, CP-2a.6, CP-2a.7, CP-2d, CP-2e, CP-2(5), SA-15a.4, SC-5(2), SC-22, SI-13(5)).',
      explanation:
        'Ensure Amazon Relational Database Service (Amazon RDS) instances and clusters have deletion protection enabled. Use deletion protection to prevent your Amazon RDS DB instances and clusters from being accidentally or maliciously deleted, which can lead to loss of availability for your applications.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSInstanceDeletionProtectionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSInstancePublicAccess',
      info: 'The RDS DB Instance allows public access - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'Amazon RDS database instances can contain sensitive information, and principles and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSInstancePublicAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSLoggingEnabled',
      info: 'The RDS DB Instance does not have all CloudWatch log types exported - (Control IDs: AC-2(4), AC-3(1), AC-3(10), AC-4(26), AC-6(9), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-8b, AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), CA-7b, CM-5(1)(b), IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SI-1(1)(c), SI-3(8)(b), SI-4(2), SI-4(17), SI-4(20), SI-7(8), SI-10(1)(c)).',
      explanation:
        'To help with logging and monitoring within your environment, ensure Amazon Relational Database Service (Amazon RDS) logging is enabled. With Amazon RDS logging, you can capture events such as connections, disconnections, queries, or tables queried.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSMultiAZSupport',
      info: 'The RDS DB Instance does not have multi-AZ support - (Control IDs: CP-1a.1(b), CP-1a.2, CP-2a, CP-2a.6, CP-2a.7, CP-2d, CP-2e, CP-2(5), CP-2(6), CP-6(2), CP-10, SC-5(2), SC-6, SC-22, SC-36, SI-13(5)).',
      explanation:
        'Multi-AZ support in Amazon Relational Database Service (Amazon RDS) provides enhanced availability and durability for database instances. When you provision a Multi-AZ database instance, Amazon RDS automatically creates a primary database instance, and synchronously replicates the data to a standby instance in a different Availability Zone. In case of an infrastructure failure, Amazon RDS performs an automatic failover to the standby so that you can resume database operations as soon as the failover is complete.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSMultiAZSupport,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RDSStorageEncrypted',
      info: 'The RDS DB Instance or Aurora Cluster does not have storage encrypted - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist at rest in Amazon RDS instances, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RDSStorageEncrypted,
      node: node,
    });
  }

  /**
   * Check Redshift Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkRedshift(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RedshiftBackupEnabled',
      info: 'The Redshift cluster does not have automated snapshots enabled or the retention period is not between 1 and 35 days - (Control IDs: CP-1(2), CP-2(5), CP-6a, CP-6(1), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), SC-5(2), SI-13(5)).',
      explanation:
        'To help with data back-up processes, ensure your Amazon Redshift clusters have automated snapshots. When automated snapshots are enabled for a cluster, Redshift periodically takes snapshots of that cluster. By default, Redshift takes a snapshot every eight hours or every 5 GB per node of data changes, or whichever comes first.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RedshiftBackupEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RedshiftClusterConfiguration',
      info: 'The Redshift cluster does not have encryption or audit logging enabled - (Control IDs: AC-2(4), AC-3(1), AC-3(10), AC-4(26), AC-6(9), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-8b, AU-9(3), AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), CA-7b, CM-5(1)(b), CP-9d, IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-1(1)(c), SI-3(8)(b), SI-4(2), SI-4(17), SI-4(20), SI-7(8), SI-10(1)(c), SI-19(4)).',
      explanation:
        'To protect data at rest, ensure that encryption is enabled for your Amazon Redshift clusters. You must also ensure that required configurations are deployed on Amazon Redshift clusters. The audit logging should be enabled to provide information about connections and user activities in the database.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RedshiftClusterConfiguration,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RedshiftClusterMaintenanceSettings',
      info: 'The Redshift cluster does not have version upgrades enabled, automated snapshot retention periods enabled, and an explicit maintenance window configured - (Control IDs: CM-2b, CM-2b.1, CM-2b.2, CM-2b.3, CM-3(3), CP-9a, CP-9b, CP-9c, SC-5(2), SI-2c, SI-2d, SI-2(2), SI-2(5)).',
      explanation:
        'Ensure that Amazon Redshift clusters have the preferred settings for your organization. Specifically, that they have preferred maintenance windows and automated snapshot retention periods for the database.                                                                                                                                                                                                                                                                                                                                                              ',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RedshiftClusterMaintenanceSettings,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RedshiftClusterPublicAccess',
      info: 'The Redshift cluster allows public access - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'Amazon Redshift clusters can contain sensitive information and principles and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RedshiftClusterPublicAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-RedshiftEnhancedVPCRoutingEnabled',
      info: 'The Redshift cluster does not have enhanced VPC routing enabled - (Control IDs: AC-4(21), SC-7b).',
      explanation:
        'Enhanced VPC routing forces all COPY and UNLOAD traffic between the cluster and data repositories to go through your Amazon VPC. You can then use VPC features such as security groups and network access control lists to secure network traffic. You can also use VPC flow logs to monitor network traffic.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5RedshiftEnhancedVPCRoutingEnabled,
      node: node,
    });
  }

  /**
   * Check Amazon S3 Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkS3(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketLevelPublicAccessProhibited',
      info: 'The S3 bucket does not prohibit public access through bucket level settings - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'Keep sensitive data safe from unauthorized remote users by preventing public access at the bucket level.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketLevelPublicAccessProhibited,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketLoggingEnabled',
      info: 'The S3 Buckets does not have server access logs enabled - (Control IDs: AC-2(4), AC-3(1), AC-3(10), AC-4(26), AC-6(9), AU-2b, AU-3a, AU-3b, AU-3c, AU-3d, AU-3e, AU-3f, AU-6(3), AU-6(4), AU-6(6), AU-6(9), AU-8b, AU-10, AU-12a, AU-12c, AU-12(1), AU-12(2), AU-12(3), AU-12(4), AU-14a, AU-14b, AU-14b, AU-14(3), CA-7b, CM-5(1)(b), CM-6a, CM-9b, IA-3(3)(b), MA-4(1)(a), PM-14a.1, PM-14b, PM-31, SC-7(9)(b), SI-1(1)(c), SI-3(8)(b), SI-4(2), SI-4(17), SI-4(20), SI-7(8), SI-10(1)(c)).',
      explanation:
        'Amazon Simple Storage Service (Amazon S3) server access logging provides a method to monitor the network for potential cybersecurity events. The events are monitored by capturing detailed records for the requests that are made to an Amazon S3 bucket. Each access log record provides details about a single access request. The details include the requester, bucket name, request time, request action, response status, and an error code, if relevant.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketPublicReadProhibited',
      info: 'The S3 Bucket does not prohibit public read access through its Block Public Access configurations and bucket ACLs - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), CM-6a, CM-9b, MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'The management of access should be consistent with the classification of the data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketPublicReadProhibited,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketPublicWriteProhibited',
      info: 'The S3 Bucket does not prohibit public write access through its Block Public Access configurations and bucket ACLs - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), CM-6a, CM-9b, MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'The management of access should be consistent with the classification of the data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketPublicWriteProhibited,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketReplicationEnabled',
      info: 'The S3 Bucket does not have replication enabled - (Control IDs: AU-9(2), CM-6a, CM-9b, CP-1(2), CP-2(5), CP-6a, CP-6(1), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), SC-5(2), SI-13(5)).',
      explanation:
        'Amazon Simple Storage Service (Amazon S3) Cross-Region Replication (CRR) supports maintaining adequate capacity and availability. CRR enables automatic, asynchronous copying of objects across Amazon S3 buckets to help ensure that data availability is maintained.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketReplicationEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketServerSideEncryptionEnabled',
      info: 'The S3 Bucket does not have default server-side encryption enabled - (Control IDs: AU-9(3), CM-6a, CM-9b, CP-9d, CP-9(8), PM-11b, SC-8(3), SC-8(4), SC-13a, SC-16(1), SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist at rest in Amazon S3 buckets, enable encryption to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketServerSideEncryptionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3BucketVersioningEnabled',
      info: 'The S3 Bucket does not have versioning enabled - (Control IDs: AU-9(2), CP-1(2), CP-2(5), CP-6a, CP-6(1), CP-6(2), CP-9a, CP-9b, CP-9c, CP-10, CP-10(2), PM-11b, PM-17b, SC-5(2), SC-16(1), SI-1a.2, SI-1a.2, SI-1c.2, SI-13(5)).',
      explanation:
        'Use versioning to preserve, retrieve, and restore every version of every object stored in your Amazon S3 bucket. Versioning helps you to easily recover from unintended user actions and application failures.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3BucketVersioningEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-S3DefaultEncryptionKMS',
      info: 'The S3 Bucket is not encrypted with a KMS Key by default - (Control IDs: AU-9(3), CP-9d, CP-9(8), SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Ensure that encryption is enabled for your Amazon Simple Storage Service (Amazon S3) buckets. Because sensitive data can exist at rest in an Amazon S3 bucket, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5S3DefaultEncryptionKMS,
      node: node,
    });
  }

  /**
   * Check SageMaker Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkSageMaker(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-SageMakerEndpointConfigurationKMSKeyConfigured',
      info: 'The SageMaker resource endpoint is not encrypted with a KMS key - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist at rest in SageMaker endpoint, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5SageMakerEndpointConfigurationKMSKeyConfigured,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-SageMakerNotebookInstanceKMSKeyConfigured',
      info: 'The SageMaker notebook is not encrypted with a KMS key - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'Because sensitive data can exist at rest in SageMaker notebook, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5SageMakerNotebookInstanceKMSKeyConfigured,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-SageMakerNotebookNoDirectInternetAccess',
      info: 'The SageMaker notebook does not disable direct internet access - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'By preventing direct internet access, you can keep sensitive data from being accessed by unauthorized users.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5SageMakerNotebookNoDirectInternetAccess,
      node: node,
    });
  }

  /**
   * Check Secrets Manager Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkSecretsManager(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-SecretsManagerUsingKMSKey',
      info: 'The secret is not encrypted with a KMS Customer managed key - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1), SI-19(4)).',
      explanation:
        'To help protect data at rest, ensure encryption with AWS Key Management Service (AWS KMS) is enabled for AWS Secrets Manager secrets. Because sensitive data can exist at rest in Secrets Manager secrets, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5SecretsManagerUsingKMSKey,
      node: node,
    });
  }

  /**
   * Check Amazon SNS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkSNS(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-SNSEncryptedKMS',
      info: 'The SNS topic does not have KMS encryption enabled - (Control IDs: AU-9(3), CP-9d, SC-8(3), SC-8(4), SC-13a, SC-28(1)).',
      explanation:
        'To help protect data at rest, ensure that your Amazon Simple Notification Service (Amazon SNS) topics require encryption using AWS Key Management Service (AWS KMS) Because sensitive data can exist at rest in published messages, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5SNSEncryptedKMS,
      node: node,
    });
  }

  /**
   * Check VPC Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkVPC(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R5-VPCDefaultSecurityGroupClosed',
      info: "The VPC's default security group allows inbound or outbound traffic - (Control IDs: AC-4(21), AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), CM-6a, CM-9b, SC-7a, SC-7c, SC-7(5), SC-7(7), SC-7(11), SC-7(12), SC-7(16), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28)).",
      explanation:
        'Amazon Elastic Compute Cloud (Amazon EC2) security groups can help in the management of network access by providing stateful filtering of ingress and egress network traffic to AWS resources. Restricting all the traffic on the default security group helps in restricting remote access to your AWS resources.',
      level: NagMessageLevel.WARN,
      rule: nist80053r5VPCDefaultSecurityGroupClosed,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-VPCNoUnrestrictedRouteToIGW',
      info: "The route table may contain one or more unrestricted route(s) to an IGW ('0.0.0.0/0' or '::/0') - (Control IDs: AC-4(21), CM-7b).",
      explanation:
        'Ensure Amazon EC2 route tables do not have unrestricted routes to an internet gateway. Removing or limiting the access to the internet for workloads within Amazon VPCs can reduce unintended access within your environment.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5VPCNoUnrestrictedRouteToIGW,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R5-VPCSubnetAutoAssignPublicIpDisabled',
      info: 'The subnet auto-assigns public IP addresses - (Control IDs: AC-2(6), AC-3, AC-3(7), AC-4(21), AC-6, AC-17b, AC-17(1), AC-17(1), AC-17(4)(a), AC-17(9), AC-17(10), MP-2, SC-7a, SC-7b, SC-7c, SC-7(2), SC-7(3), SC-7(7), SC-7(9)(a), SC-7(11), SC-7(12), SC-7(16), SC-7(20), SC-7(21), SC-7(24)(b), SC-7(25), SC-7(26), SC-7(27), SC-7(28), SC-25).',
      explanation:
        'Manage access to the AWS Cloud by ensuring Amazon Virtual Private Cloud (VPC) subnets are not automatically assigned a public IP address. Amazon Elastic Compute Cloud (EC2) instances that are launched into subnets that have this attribute enabled have a public IP address assigned to their primary network interface.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r5VPCSubnetAutoAssignPublicIpDisabled,
      node: node,
    });
  }
}
