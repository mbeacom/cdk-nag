/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

import { CfnResource, IConstruct } from '@aws-cdk/core';
import { NagPack, NagMessageLevel } from '../nag-pack';
import {
  nist80053r4APIGWCacheEnabledAndEncrypted,
  nist80053r4APIGWExecutionLoggingEnabled,
} from './rules/apigw';
import { nist80053r4AutoScalingHealthChecks } from './rules/autoscaling';
import {
  nist80053r4CloudTrailCloudWatchLogsEnabled,
  nist80053r4CloudTrailEncryptionEnabled,
  nist80053r4CloudTrailLogFileValidationEnabled,
} from './rules/cloudtrail';
import {
  nist80053r4CloudWatchAlarmAction,
  nist80053r4CloudWatchLogGroupEncrypted,
} from './rules/cloudwatch';
import {
  nist80053r4CodeBuildCheckEnvVars,
  nist80053r4CodeBuildURLCheck,
} from './rules/codebuild';
import { nist80053r4DMSReplicationNotPublic } from './rules/dms';
import { nist80053r4DynamoDBPITREnabled } from './rules/dynamodb';
import {
  nist80053r4EC2CheckCommonPortsRestricted,
  nist80053r4EC2CheckDefaultSecurityGroupClosed,
  nist80053r4EC2CheckDetailedMonitoring,
  nist80053r4EC2CheckInsideVPC,
  nist80053r4EC2CheckNoPublicIPs,
  nist80053r4EC2CheckSSHRestricted,
} from './rules/ec2';
import { nist80053r4EFSEncrypted } from './rules/efs';
import { nist80053r4ElastiCacheRedisClusterAutomaticBackup } from './rules/elasticache';
import {
  nist80053r4ALBHttpDropInvalidHeaderEnabled,
  nist80053r4ALBHttpToHttpsRedirection,
  nist80053r4ELBCrossZoneBalancing,
  nist80053r4ELBDeletionProtectionEnabled,
  nist80053r4ELBListenersUseSSLOrHTTPS,
  nist80053r4ELBLoggingEnabled,
  nist80053r4ELBUseACMCerts,
} from './rules/elb';
import { nist80053r4EMRKerberosEnabled } from './rules/emr';
import {
  nist80053r4IAMGroupMembership,
  nist80053r4IAMNoInlinePolicy,
  nist80053r4IAMPolicyNoStatementsWithAdminAccess,
  nist80053r4IAMUserNoPolicies,
} from './rules/iam';
import { nist80053r4LambdaFunctionsInsideVPC } from './rules/lambda';
import {
  nist80053r4OpenSearchEncryptedAtRest,
  nist80053r4OpenSearchNodeToNodeEncrypted,
  nist80053r4OpenSearchRunningWithinVPC,
} from './rules/opensearch';
import {
  nist80053r4RDSEnhancedMonitoringEnabled,
  nist80053r4RDSInstanceBackupEnabled,
  nist80053r4RDSInstanceDeletionProtectionEnabled,
  nist80053r4RDSInstanceMultiAZSupport,
  nist80053r4RDSInstancePublicAccess,
  nist80053r4RDSLoggingEnabled,
  nist80053r4RDSStorageEncrypted,
} from './rules/rds';
import {
  nist80053r4RedshiftClusterConfiguration,
  nist80053r4RedshiftClusterPublicAccess,
} from './rules/redshift';
import {
  nist80053r4S3BucketDefaultLockEnabled,
  nist80053r4S3BucketLoggingEnabled,
  nist80053r4S3BucketPublicReadProhibited,
  nist80053r4S3BucketPublicWriteProhibited,
  nist80053r4S3BucketReplicationEnabled,
  nist80053r4S3BucketServerSideEncryptionEnabled,
  nist80053r4S3BucketVersioningEnabled,
} from './rules/s3';
import {
  nist80053r4SageMakerEndpointKMS,
  nist80053r4SageMakerNotebookDirectInternetAccessDisabled,
  nist80053r4SageMakerNotebookKMS,
} from './rules/sagemaker';
import { nist80053r4SNSEncryptedKMS } from './rules/sns';

/**
 * Check for NIST 800-53 rev 4 compliance.
 * Based on the NIST 800-53 rev 4 AWS operational best practices: https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-nist-800-53_rev_4.html
 */
export class NIST80053R4Checks extends NagPack {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      this.checkAPIGW(node);
      this.checkAutoScaling(node);
      this.checkCloudTrail(node);
      this.checkCloudWatch(node);
      this.checkCodeBuild(node);
      this.checkDMS(node);
      this.checkDynamoDB(node);
      this.checkEC2(node);
      this.checkEFS(node);
      this.checkElastiCache(node);
      this.checkELB(node);
      this.checkEMR(node);
      this.checkIAM(node);
      this.checkLambda(node);
      this.checkOpenSearch(node);
      this.checkRDS(node);
      this.checkRedshift(node);
      this.checkS3(node);
      this.checkSageMaker(node);
      this.checkSNS(node);
    }
  }

  /**
   * Check API Gateway Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkAPIGW(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R4-APIGWCacheEnabledAndEncrypted',
      info: 'The API Gateway stage does not have caching enabled and encrypted for all methods - (Control IDs: SC-13, SC-28).',
      explanation:
        "To help protect data at rest, ensure encryption is enabled for your API Gateway stage's cache. Because sensitive data can be captured for the API method, enable encryption at rest to help protect that data.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r4APIGWCacheEnabledAndEncrypted,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-APIGWExecutionLoggingEnabled',
      info: 'The API Gateway stage does not have execution logging enabled for all methods - (Control IDs: AU-2(a)(d), AU-3, AU-12(a)(c)).',
      explanation:
        'API Gateway logging displays detailed views of users who accessed the API and the way they accessed the API. This insight enables visibility of user activities.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4APIGWExecutionLoggingEnabled,
      node: node,
    });
  }

  /**
   * Check Auto Scaling Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkAutoScaling(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R4-AutoScalingHealthChecks',
      info: 'The Auto Scaling group utilizes a load balancer and does not have an ELB health check configured - (Control IDs: SC-5).',
      explanation:
        'The Elastic Load Balancer (ELB) health checks for Amazon Elastic Compute Cloud (Amazon EC2) Auto Scaling groups support maintenance of adequate capacity and availability.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4AutoScalingHealthChecks,
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
      ruleId: 'NIST.800.53.R4-CloudTrailCloudWatchLogsEnabled',
      info: 'The trail does not have CloudWatch logs enabled - (Control IDs: AC-2(4), AC-2(g), AU-2(a)(d), AU-3, AU-6(1)(3), AU-7(1), AU-12(a)(c), CA-7(a)(b), SI-4(2), SI-4(4), SI-4(5), SI-4(a)(b)(c)).',
      explanation:
        'Use Amazon CloudWatch to centrally collect and manage log event activity. Inclusion of AWS CloudTrail data provides details of API call activity within your AWS account.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CloudTrailCloudWatchLogsEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-CloudTrailEncryptionEnabled',
      info: 'The trail does not have a KMS key ID or have encryption enabled - (Control ID: AU-9).',
      explanation:
        'Because sensitive data may exist and to help protect data at rest, ensure encryption is enabled for your AWS CloudTrail trails.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CloudTrailEncryptionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-CloudTrailLogFileValidationEnabled',
      info: 'The trail does not have log file validation enabled - (Control ID: AC-6).',
      explanation:
        'Utilize AWS CloudTrail log file validation to check the integrity of CloudTrail logs. Log file validation helps determine if a log file was modified or deleted or unchanged after CloudTrail delivered it. This feature is built using industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing. This makes it computationally infeasible to modify, delete or forge CloudTrail log files without detection.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CloudTrailLogFileValidationEnabled,
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
      ruleId: 'NIST.800.53.R4-CloudWatchAlarmAction',
      info: 'The CloudWatch alarm does not have at least one alarm action, one INSUFFICIENT_DATA action, or one OK action enabled - (Control IDs: AC-2(4), AU-6(1)(3), AU-7(1), CA-7(a)(b), IR-4(1), SI-4(2), SI-4(4), SI-4(5), SI-4(a)(b)(c)).',
      explanation:
        'Amazon CloudWatch alarms alert when a metric breaches the threshold for a specified number of evaluation periods. The alarm performs one or more actions based on the value of the metric or expression relative to a threshold over a number of time periods.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CloudWatchAlarmAction,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-CloudWatchLogGroupEncrypted',
      info: 'The CloudWatch Log Group is not encrypted with an AWS KMS key - (Control IDs: AU-9, SC-13, SC-28).',
      explanation:
        'To help protect sensitive data at rest, ensure encryption is enabled for your Amazon CloudWatch Log Groups.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CloudWatchLogGroupEncrypted,
      node: node,
    });
  }

  /**
   * Check CodeBuild Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkCodeBuild(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R4-CodeBuildCheckEnvVars',
      info: 'The CodeBuild environment stores sensitive credentials (such as AWS_ACCESS_KEY_ID and/or AWS_SECRET_ACCESS_KEY) as plaintext environment variables - (Control IDs: AC-6, IA-5(7), SA-3(a)).',
      explanation:
        'Do not store these variables in clear text. Storing these variables in clear text leads to unintended data exposure and unauthorized access.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CodeBuildCheckEnvVars,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-CodeBuildURLCheck',
      info: 'The CodeBuild project which utilizes either a GitHub or BitBucket source repository does not utilize OAUTH - (Control ID: SA-3(a)).',
      explanation:
        'OAUTH is the most secure method of authenticating your CodeBuild application. Use OAuth instead of personal access tokens or a user name and password to grant authorization for accessing GitHub or Bitbucket repositories.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4CodeBuildURLCheck,
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
      ruleId: 'NIST.800.53.R4-DMSReplicationNotPublic',
      info: 'The DMS replication instance is public - (Control IDs: AC-3).',
      explanation:
        'DMS replication instances can contain sensitive information and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4DMSReplicationNotPublic,
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
      ruleId: 'NIST.800.53.R4-DynamoDBPITREnabled',
      info: 'The DynamoDB table does not have Point-in-time Recovery enabled - (Control IDs: CP-9(b), CP-10, SI-12).',
      explanation:
        'The recovery maintains continuous backups of your table for the last 35 days.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4DynamoDBPITREnabled,
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
      ruleId: 'NIST.800.53.R4-EC2CheckDefaultSecurityGroupClosed',
      info: "The VPC's default security group allows inbound or outbound traffic - (Control IDs: AC-4, SC-7, SC-7(3)).",
      explanation:
        'When creating a VPC through CloudFormation, the default security group will always be open. Therefore it is important to always close the default security group after stack creation whenever a VPC is created. Restricting all the traffic on the default security group helps in restricting remote access to your AWS resources.',
      level: NagMessageLevel.WARN,
      rule: nist80053r4EC2CheckDefaultSecurityGroupClosed,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EC2CheckDetailedMonitoring',
      info: 'The EC2 instance does not have detailed monitoring enabled - (Control IDs: CA-7(a)(b), SI-4(2), SI-4(a)(b)(c)).',
      explanation:
        'Detailed monitoring provides additional monitoring information (such as 1-minute period graphs) on the AWS console.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EC2CheckDetailedMonitoring,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EC2CheckInsideVPC',
      info: 'The EC2 instance is not within a VPC - (Control IDs: AC-4, SC-7, SC-7(3)).',
      explanation:
        'Because of their logical isolation, domains that reside within an Amazon VPC have an extra layer of security when compared to domains that use public endpoints.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EC2CheckInsideVPC,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EC2CheckNoPublicIPs',
      info: 'The EC2 instance is associated with a public IP address - (Control IDs: AC-4, AC-6, AC-21(b), SC-7, SC-7(3)). ',
      explanation:
        'Amazon EC2 instances can contain sensitive information and access control is required for such resources.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EC2CheckNoPublicIPs,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EC2CheckSSHRestricted',
      info: 'The Security Group allows unrestricted SSH access - (Control IDs: AC-4, SC-7, SC-7(3)).',
      explanation:
        'Not allowing ingress (or remote) traffic from 0.0.0.0/0 or ::/0 to port 22 on your resources helps to restrict remote access.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EC2CheckSSHRestricted,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EC2CheckCommonPortsRestricted',
      info: 'The EC2 instance allows unrestricted inbound IPv4 TCP traffic on common ports (20, 21, 3389, 3306, 4333) - (Control IDs: AC-4, CM-2, SC-7, SC-7(3)).',
      explanation:
        'Not restricting access to ports to trusted sources can lead to attacks against the availability, integrity and confidentiality of systems. By default, common ports which should be restricted include port numbers 20, 21, 3389, 3306, and 4333.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EC2CheckCommonPortsRestricted,
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
      ruleId: 'NIST.800.53.R4-EFSEncrypted',
      info: 'The EFS does not have encryption at rest enabled - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist and to help protect data at rest, ensure encryption is enabled for your Amazon Elastic File System (EFS).',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EFSEncrypted,
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
      ruleId: 'NIST.800.53.R4-ElastiCacheRedisClusterAutomaticBackup',
      info: 'The ElastiCache Redis cluster does not retain automatic backups for at least 15 days - (Control IDs: CP-9(b), CP-10, SI-12).',
      explanation:
        'Automatic backups can help guard against data loss. If a failure occurs, you can create a new cluster, which restores your data from the most recent backup.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ElastiCacheRedisClusterAutomaticBackup,
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
      ruleId: 'NIST.800.53.R4-ALBHttpDropInvalidHeaderEnabled',
      info: 'The ALB does not have invalid HTTP header dropping enabled - (Control ID: AC-17(2)).',
      explanation:
        'Ensure that your Application Load Balancers (ALB) are configured to drop http headers. Because sensitive data can exist, enable encryption in transit to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ALBHttpDropInvalidHeaderEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ALBHttpToHttpsRedirection',
      info: "The ALB's HTTP listeners are not configured to redirect to HTTPS - (Control IDs: AC-17(2), SC-7, SC-8, SC-8(1), SC-13, SC-23).",
      explanation:
        'To help protect data in transit, ensure that your Application Load Balancer automatically redirects unencrypted HTTP requests to HTTPS. Because sensitive data can exist, enable encryption in transit to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ALBHttpToHttpsRedirection,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ELBCrossZoneBalancing',
      info: 'The CLB does not balance traffic between at least 2 Availability Zones - (Control IDs: SC-5, CP-10).',
      explanation:
        'The cross-zone load balancing reduces the need to maintain equivalent numbers of instances in each enabled availability zone.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ELBCrossZoneBalancing,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ELBDeletionProtectionEnabled',
      info: 'The ALB, NLB, or GLB does not have deletion protection enabled - (Control IDs: CM-2, CP-10).',
      explanation:
        'Use this feature to prevent your load balancer from being accidentally or maliciously deleted, which can lead to loss of availability for your applications.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ELBDeletionProtectionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ELBListenersUseSSLOrHTTPS',
      info: 'The CLB does not restrict its listeners to only the SSL and HTTPS protocols - (Control IDs: AC-17(2), SC-7, SC-8, SC-8(1), SC-23).',
      explanation:
        'Because sensitive data can exist, enable encryption in transit to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ELBListenersUseSSLOrHTTPS,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ELBLoggingEnabled',
      info: 'The ELB does not have logging enabled - (Control ID: AU-2(a)(d)).',
      explanation:
        "Elastic Load Balancing activity is a central point of communication within an environment. Ensure ELB logging is enabled. The collected data provides detailed information about requests sent to The ELB. Each log contains information such as the time the request was received, the client's IP address, latencies, request paths, and server responses.",
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ELBLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-ELBUseACMCerts',
      info: 'The CLB does not utilize an SSL certificate provided by ACM (Amazon Certificate Manager) - (Control IDs: AC-17(2), SC-7, SC-8, SC-8(1), SC-13).',
      explanation:
        'Because sensitive data can exist and to help protect data at transit, ensure encryption is enabled for your Elastic Load Balancing. Use AWS Certificate Manager to manage, provision and deploy public and private SSL/TLS certificates with AWS services and internal resources.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4ELBUseACMCerts,
      node: node,
    });
  }

  /**
   * Check EMR Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkEMR(node: CfnResource) {
    this.applyRule({
      ruleId: 'NIST.800.53.R4-EMRKerberosEnabled',
      info: 'The EMR cluster does not have Kerberos enabled - (Control IDs: AC-2(j), AC-3, AC-5c, AC-6).',
      explanation:
        'The access permissions and authorizations can be managed and incorporated with the principles of least privilege and separation of duties, by enabling Kerberos for Amazon EMR clusters.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4EMRKerberosEnabled,
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
      ruleId: 'NIST.800.53.R4-IAMGroupMembership',
      info: 'The IAM user does not belong to any group(s) - (Control IDs: AC-2(1), AC-2(j), AC-3, and AC-6).',
      explanation:
        'AWS Identity and Access Management (IAM) can help you restrict access permissions and authorizations, by ensuring IAM users are members of at least one group. Allowing users more privileges than needed to complete a task may violate the principle of least privilege and separation of duties.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4IAMGroupMembership,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-IAMNoInlinePolicy',
      info: 'The IAM Group, User, or Role contains an inline policy - (Control ID: AC-6).',
      explanation:
        'AWS recommends to use managed policies instead of inline policies. The managed policies allow reusability, versioning and rolling back, and delegating permissions management.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4IAMNoInlinePolicy,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-IAMPolicyNoStatementsWithAdminAccess',
      info: 'The IAM policy grants admin access - (Control IDs: AC-2(1), AC-2(j), AC-3, AC-6).',
      explanation:
        'AWS Identity and Access Management (IAM) can help you incorporate the principles of least privilege and separation of duties with access permissions and authorizations, restricting policies from containing "Effect": "Allow" with "Action": "*" over "Resource": "*". Allowing users to have more privileges than needed to complete a task may violate the principle of least privilege and separation of duties.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4IAMPolicyNoStatementsWithAdminAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-IAMUserNoPolicies',
      info: 'The IAM policy is attached at the user level - (Control IDs: AC-2(j), AC-3, AC-5c, AC-6).',
      explanation:
        'Assigning privileges at the group or the role level helps to reduce opportunity for an identity to receive or retain excessive privileges.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4IAMUserNoPolicies,
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
      ruleId: 'NIST.800.53.R4-LambdaFunctionsInsideVPC',
      info: 'The Lambda function is not VPC enabled - (Control IDs: AC-4, SC-7, SC-7(3)).',
      explanation:
        'Because of their logical isolation, domains that reside within an Amazon VPC have an extra layer of security when compared to domains that use public endpoints.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4LambdaFunctionsInsideVPC,
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
      ruleId: 'NIST.800.53.R4-OpenSearchEncryptedAtRest',
      info: 'The OpenSearch Service domain does not have encryption at rest enabled - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist and to help protect data at rest, ensure encryption is enabled for your Amazon OpenSearch Service (OpenSearch Service) domains.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4OpenSearchEncryptedAtRest,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-OpenSearchNodeToNodeEncrypted',
      info: 'The OpenSearch Service domain does not have node-to-node encryption enabled - (Control IDs: SC-7, SC-8, SC-8(1)).',
      explanation:
        'Because sensitive data can exist, enable encryption in transit to help protect that data within your Amazon OpenSearch Service (OpenSearch Service) domains.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4OpenSearchNodeToNodeEncrypted,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-OpenSearchRunningWithinVPC',
      info: 'The OpenSearch Service domain is not running within a VPC - (Control IDs: AC-4, SC-7, SC-7(3)).',
      explanation:
        'VPCs help secure your AWS resources and provide an extra layer of protection.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4OpenSearchRunningWithinVPC,
      node: node,
    });
  }

  /**
   * Check Amazon RDS Resources
   * @param node the CfnResource to check
   * @param ignores list of ignores for the resource
   */
  private checkRDS(node: CfnResource): void {
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSEnhancedMonitoringEnabled',
      info: 'The RDS DB instance does not enhanced monitoring enabled - (Control ID: CA-7(a)(b)).',
      explanation:
        'Enable enhanced monitoring to help monitor Amazon RDS availability. This provides detailed visibility into the health of your Amazon RDS database instances.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSEnhancedMonitoringEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSInstanceBackupEnabled',
      info: 'The RDS DB instance does not have backups enabled - (Control IDs: CP-9(b), CP-10, SI-12).',
      explanation:
        'The backup feature of Amazon RDS creates backups of your databases and transaction logs.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSInstanceBackupEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSInstanceDeletionProtectionEnabled',
      info: 'The RDS DB instance or Aurora DB cluster does not have deletion protection enabled - (Control ID: SC-5).',
      explanation:
        'Ensure Amazon Relational Database Service (Amazon RDS) instances and clusters have deletion protection enabled. Use deletion protection to prevent your Amazon RDS DB instances and clusters from being accidentally or maliciously deleted, which can lead to loss of availability for your applications.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSInstanceDeletionProtectionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSInstanceMultiAZSupport',
      info: 'The non-Aurora RDS DB instance does not have multi-AZ support enabled - (Control IDs: CP-10, SC-5, SC-36).',
      explanation:
        'Multi-AZ support in Amazon Relational Database Service (Amazon RDS) provides enhanced availability and durability for database instances. When you provision a Multi-AZ database instance, Amazon RDS automatically creates a primary database instance, and synchronously replicates the data to a standby instance in a different Availability Zone. In case of an infrastructure failure, Amazon RDS performs an automatic failover to the standby so that you can resume database operations as soon as the failover is complete.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSInstanceMultiAZSupport,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSInstancePublicAccess',
      info: 'The RDS DB instance allows public access - (Control IDs: AC-4, AC-6, AC-21(b), SC-7, SC-7(3)).',
      explanation:
        'Amazon RDS database instances can contain sensitive information, and principles and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSInstancePublicAccess,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSLoggingEnabled',
      info: 'The RDS DB instance does not have all CloudWatch log types exported - (Control IDs: AC-2(4), AC-2(g), AU-2(a)(d), AU-3, AU-12(a)(c)).',
      explanation:
        'To help with logging and monitoring within your environment, ensure Amazon Relational Database Service (Amazon RDS) logging is enabled. With Amazon RDS logging, you can capture events such as connections, disconnections, queries, or tables queried.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RDSStorageEncrypted',
      info: 'The RDS DB instance or Aurora DB cluster does not have storage encrypted - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist at rest in Amazon RDS DB instances and clusters, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RDSStorageEncrypted,
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
      ruleId: 'NIST.800.53.R4-RedshiftClusterConfiguration',
      info: 'The Redshift cluster does not have encryption or audit logging enabled - (Control IDs: AC-2(4), AC-2(g), AU-2(a)(d), AU-3, AU-12(a)(c), SC-13).',
      explanation:
        'To protect data at rest, ensure that encryption is enabled for your Amazon Redshift clusters. You must also ensure that required configurations are deployed on Amazon Redshift clusters. The audit logging should be enabled to provide information about connections and user activities in the database.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RedshiftClusterConfiguration,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-RedshiftClusterPublicAccess',
      info: 'The Redshift cluster allows public access - (Control IDs: AC-3, AC-4, AC-6, AC-21(b), SC-7, SC-7(3)).',
      explanation:
        'Amazon Redshift clusters can contain sensitive information and principles and access control is required for such accounts.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4RedshiftClusterPublicAccess,
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
      ruleId: 'NIST.800.53.R4-S3BucketDefaultLockEnabled',
      info: 'The S3 Bucket does not have object lock enabled - (Control ID: SC-28).',
      explanation:
        'Because sensitive data can exist at rest in S3 buckets, enforce object locks at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketDefaultLockEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketLoggingEnabled',
      info: 'The S3 Bucket does not have server access logs enabled - (Control IDs: AC-2(g), AU-2(a)(d), AU-3, AU-12(a)(c)).',
      explanation:
        'Amazon Simple Storage Service (Amazon S3) server access logging provides a method to monitor the network for potential cybersecurity events. The events are monitored by capturing detailed records for the requests that are made to an Amazon S3 bucket. Each access log record provides details about a single access request. The details include the requester, bucket name, request time, request action, response status, and an error code, if relevant.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketLoggingEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketPublicReadProhibited',
      info: 'The S3 Bucket does not prohibit public read access through its Block Public Access configurations and bucket ACLs - (Control IDs: AC-3, AC-4, AC-6, AC-21(b), SC-7, SC-7(3)).',
      explanation:
        'The management of access should be consistent with the classification of the data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketPublicReadProhibited,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketPublicWriteProhibited',
      info: 'The S3 Bucket does not prohibit public write access through its Block Public Access configurations and bucket ACLs - (Control IDs: AC-3, AC-4, AC-6, AC-21(b), SC-7, SC-7(3)).',
      explanation:
        'The management of access should be consistent with the classification of the data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketPublicWriteProhibited,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketReplicationEnabled',
      info: 'The S3 Bucket does not have replication enabled - (Control IDs: AU-9(2), CP-9(b), CP-10, SC-5, SC-36).',
      explanation:
        'Amazon Simple Storage Service (Amazon S3) Cross-Region Replication (CRR) supports maintaining adequate capacity and availability. CRR enables automatic, asynchronous copying of objects across Amazon S3 buckets to help ensure that data availability is maintained.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketReplicationEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketServerSideEncryptionEnabled',
      info: 'The S3 Bucket does not have default server-side encryption enabled - (Control IDs: AU-9(2), CP-9(b), CP-10, SC-5, SC-36).',
      explanation:
        'Because sensitive data can exist at rest in Amazon S3 buckets, enable encryption to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketServerSideEncryptionEnabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-S3BucketVersioningEnabled',
      info: 'The S3 Bucket does not have versioning enabled - (Control IDs: CP-10, SI-12).',
      explanation:
        'Use versioning to preserve, retrieve, and restore every version of every object stored in your Amazon S3 bucket. Versioning helps you to easily recover from unintended user actions and application failures.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4S3BucketVersioningEnabled,
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
      ruleId: 'NIST.800.53.R4-SageMakerEndpointKMS',
      info: 'The SageMaker endpoint is not encrypted with a KMS key - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist at rest in SageMaker endpoint, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4SageMakerEndpointKMS,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-SageMakerNotebookDirectInternetAccessDisabled',
      info: 'The SageMaker notebook does not disable direct internet access - (Control IDs: AC-3, AC-4, AC-6, AC-21(b), SC-7, SC-7(3)).',
      explanation:
        'By preventing direct internet access, you can keep sensitive data from being accessed by unauthorized users.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4SageMakerNotebookDirectInternetAccessDisabled,
      node: node,
    });
    this.applyRule({
      ruleId: 'NIST.800.53.R4-SageMakerNotebookKMS',
      info: 'The SageMaker notebook is not encrypted with a KMS key - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist at rest in SageMaker notebook, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4SageMakerNotebookKMS,
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
      ruleId: 'NIST.800.53.R4-SNSEncryptedKMS',
      info: 'The SNS topic does not have KMS encryption enabled - (Control IDs: SC-13, SC-28).',
      explanation:
        'Because sensitive data can exist at rest in published messages, enable encryption at rest to help protect that data.',
      level: NagMessageLevel.ERROR,
      rule: nist80053r4SNSEncryptedKMS,
      node: node,
    });
  }
}
