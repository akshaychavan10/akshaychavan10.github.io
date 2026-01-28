---
name: AWS GuardDuty Driven Cloud Security Monitoring
tools: [AWS, CloudFormation, CloudFront, S3 Buckets, GuardDuty]
image: /assets/projects/aws_infra.png
description: Demonstrated hands-on cloud security by simulating real-world attacks and using AWS GuardDuty to detect and analyze malicious activity in an AWS environment. 
---

## AWS GuardDuty Driven Cloud Security Monitoring

### Project Overview

This project demonstrates the use of Amazon GuardDuty, an AI-powered threat detection service, to identify and analyze security attacks against an intentionally insecure web application. By playing the roles of both attacker and defender, I explored how web vulnerabilities such as SQL Injection and Command Injection can be exploited to exfiltrate sensitive data from an AWS environment. The attacks were then monitored in real time using Amazon GuardDuty, enabling a clear understanding of how such threats are detected and how they can be identified, investigated, and mitigated through cloud-native security controls.

---

### **1. Infrastructure Deployment**

To simulate a real-world environment, I used **AWS CloudFormation** to deploy a vulnerable version of the **OWASP Juice Shop**.

![infra.png](/assets/projects/aws_infra.png)

- **Infrastructure as Code (IaC):** Used a template to instantly deploy **27 resources**, including a VPC, an EC2 instance (web server), an S3 bucket (storage), and a CloudFront distribution.

- **Resource Roles:** The EC2 instance acted as the engine for the web app and was granted IAM permissions to access a private S3 bucket containing "sensitive" information.

- **GuardDuty Setup:** Amazon GuardDuty was enabled at the start to monitor the environment for unusual activity.

![Phase 1.png](/assets/projects/aws_Phase_1.png)

### **2. The Attack Phase (Hacker Mode)**

The objective was to exploit the web application to steal the EC2 instance's IAM credentials and access private data.

- **Step A - SQL Injection:** I bypassed the administrative login page by entering `' or 1=1--` into the email field. This manipulated the database query to always evaluate as **True**, granting access without a valid password.

![SQL_Login.png](/assets/projects/aws_SQL_Login.png)

![admin access.png](/assets/projects/aws_admin_access.png)

- **Step B - Command Injection:** Once logged in, I navigated to the profile page and injected a **JavaScript script** into the username field. Because the application failed to **sanitize user inputs**, the web server executed the code, which exfiltrated its temporary **IAM credentials** into a publicly accessible `credentials.json` file.

![cmd injection.png](/assets/projects/aws_cmd_injection.png)

- **Step C - Credential Exfiltration:** I accessed the public URL for `credentials.json` to obtain the **Access Key ID, Secret Access Key, and Session Token**.

![s3 bucket secrets download.png](/assets/projects/aws_bucket_secrets.png)

### **3. Data Breach Execution**

Using the stolen credentials, I moved to the **AWS Command Line Interface (CLI)** via **Cloud Shell** to impersonate the web server.

- **Configuration:** I configured a new AWS CLI profile named **"attacker"** using the exfiltrated keys.

- **The Theft:** Wearing these credentials "like a suit," I bypassed standard permissions to access the victim's private S3 bucket. I successfully copied and read the contents of `secret-information.txt`, confirming the data breach.

![s3 bucket's secret file access.png](/assets/projects/aws_file_access.png)

### **4. The Defense Phase (Detection and Analysis)**

After the attack, I transitioned back to the **Defender** role to evaluate how AWS monitored the incident.

![guardduty findings.png](/assets/projects/aws_guardduty_findings.png)

- **GuardDuty Finding:** GuardDuty successfully generated a high-severity finding titled **"InstanceCredentialExfiltration"**.

- **Anomaly Detection:** The service used **Machine Learning** to detect that credentials belonging to my EC2 instance were being used by a different, remote AWS account (the Cloud Shell environment).

- **Finding Details:** GuardDuty provided the attacker's **IP address, geographic location**, and the specific **S3:GetObject** action performed.

### **5. Secret Mission: S3 Malware Protection**

To enhance the security posture, I enabled **GuardDuty Malware Protection for S3**.

![eicar file upload.png](/assets/projects/aws_eicar_upload.png)

- **Testing:** I uploaded a harmless **EICAR test file** (designed to trigger antivirus software) to the S3 bucket.

- **Result:** GuardDuty instantly flagged the file with a **"Malicious file in S3"** finding, demonstrating its ability to scan and protect storage resources from harmful uploads.

![eicar finding.png](/assets/projects/aws_eicar_finding.png)

---

### **Key Skills & Technologies**

- **Security Services:** Amazon GuardDuty (Threat Detection & Malware Protection).

- **Automation:** AWS CloudFormation (Infrastructure as Code).

- **Offensive Security:** SQL Injection, Command Injection, Credential Exfiltration.

- **DevOps/CLI:** AWS Cloud Shell, Linux commands (`wget`, `cat`, `jq`), AWS CLI Profile management.

---

This project demonstrates a complete cloud attack–to–detection lifecycle, showing how common web application vulnerabilities can escalate into serious cloud security breaches when IAM permissions are misused. By operating as both attacker and defender, I gained hands-on experience in offensive exploitation, credential abuse, and real-time threat detection using Amazon GuardDuty. The lab reinforces the importance of least-privilege IAM design, continuous monitoring, and cloud-native security controls in securing modern AWS environments.
