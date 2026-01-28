---
name: Enterprise Cybersecurity Lab Infrastructure
tools: [VirtualBox, Windows, Active Directory, SIEM]
image: /assets/projects/enterprise_lab.png
description: An end-to-end virtual lab featuring Active Directory, Wazuh monitoring, and a Kali Linux attack vector for enterprise-level cybersecurity and network administration training. 
---

# Enterprise Cybersecurity Lab Infrastructure


### Project Overview

Enterprise Cybersecurity Lab is a hands-on project that simulates a real-world enterprise network environment to test, analyze, and improve cybersecurity defenses through penetration testing and security monitoring.

This project demonstrates my ability to design, implement, and secure complex network infrastructures while simulating real-world cyber attacks.

---

### Key Features

- **Network Topology:** Designed and implemented a NAT-based network with VirtualBox, including DHCP and DNS services.

- **Active Directory:** Deployed and managed Microsoft Active Directory for user and resource management.

- **Email Server:** Configured and secured an SMTP relay server using **Postfix** on Ubuntu Server.

- **Security Monitoring:** Integrated **Wazuh** and **Security Onion** for intrusion detection and log analysis.

- **Penetration Testing:** Conducted simulated attacks using tools like **Hydra**, **Evil-WinRM**, and **NetExec**.

- **Documentation:** Created detailed, step-by-step guides for each phase of the project, from setup to attack simulation.

---

### Technical Details

##### Network Setup

- **NAT Network:** `10.0.0.0/24` with DHCP scope `10.0.0.100–10.0.0.200`.

- **Hosts:**

  - Domain Controller (`10.0.0.5`): DNS, DHCP, and Single Sign-On (SSO).

  - Email Server (`10.0.0.8`): SMTP relay server.

  - Security Server (`10.0.0.10`): Dedicated security monitoring.

  - Windows Workstation (`10.0.0.100`): Simulated business user environment.

  - Linux Desktop (`10.0.0.101`): Simulated software development environment.

  - Attacker Machine: Dynamic IP for penetration testing

##### Operating Systems

- **Windows Server 2025:** For directory services and network management.

- **Windows 11 Enterprise:** Simulates a typical business user environment.

- **Ubuntu Desktop 22.04:** For software development and security monitoring.

- **Ubuntu Server 2022:** Used as the email server.

- **Kali Linux:** For penetration testing and ethical hacking.

- **Security Onion:** For network security monitoring and intrusion detection.

##### Tools Used

- **Virtualization:** Hypervisor for virtual machine management.

- **Operating Systems:** Windows Server 2025, Windows 11 Enterprise, Ubuntu Desktop/Server, Kali Linux

- **Security Tools:** Wazuh, Security Onion, Hydra, Evil-WinRM, NetExec, XFreeRDP

- **Networking:** NAT, DHCP, DNS, Active Directory

- **Scripting:** Bash, PowerShell

---

### Visuals

##### Infrastructure Setup

![Infrastructure Setup](/assets/projects/Ent_Infra.png)

##### Active Directory Setup

![Active Directory](/assets/projects/ent_active_dir_setup.png)

---

### Red Team Operations

Simulated offensive attacks using **Kali Linux** to test network defenses:

* **Initial Access & Reconnaissance:** Performed brute-force and dictionary attacks with **Hydra**, mapped Active Directory (`corp.project-x-dc.com`) to identify high-value targets like the Domain Controller.
* **Exploitation & Lateral Movement:** Used **Evil-WinRM** and **NetExec** to execute commands, extract data, and move laterally.
* **Targeting Services:** Tested critical infrastructure such as the **Postfix Mail Server** for vulnerabilities and potential credential exploitation.

<iframe
  src="https://mitre-attack.github.io/attack-navigator/#layerURL=https://raw.githubusercontent.com/akshaychavan10/shopify_notes/refs/heads/main/red_team_attack_simulation.json"
  width="100%"
  height="800"
  style="border:1px solid #ddd;">
</iframe>

---

### Blue Team Operations

Defensive monitoring and response using a layered security stack:

* **Endpoint Security:** **Wazuh** agents collected logs from Windows and Linux hosts, with File Integrity Monitoring (FIM) and behavioral analysis for real-time alerts.

* **Network Monitoring:** **Security Onion** with **Zeek** and **Suricata** analyzed traffic for anomalies. Logs aggregated in the **Elastic Stack** enabled proactive threat hunting.

* **Isolation & Management:** Security tools were hosted on a dedicated server to protect performance and maintain separation from production systems.

![endpoint configuration](/assets/projects/wazuh_blue.png)

---

### Outcome 

- Successfully simulated a realistic enterprise network environment.
- Configured and integrated various operating systems and security tools.
- Demonstrated the ability to perform and detect cyber attacks using penetration testing tools.
- Gained hands-on experience with network security, Active Directory, and email server management.

### Learnings

- Understanding of network topologies and virtualization.
- Proficiency in configuring and managing Active Directory and Postfix.
- Insight into security monitoring and incident response using Wazuh.
- Familiarity with penetration testing tools and techniques.

---

### GitHub Repository

For more details, including scripts and configurations, check out the [GitHub Repository](https://github.com/akshaychavan10/Enterprise-Cybersecurity-Lab-Infrastructure).

---

### Let’s Connect!

Interested in learning more about this project or collaborating on something similar? Feel free to reach out to me at [mail](akschavan100@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/akshaychavan07).
