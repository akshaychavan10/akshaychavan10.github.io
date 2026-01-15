---
title: Build Directory Service
tags: [Active Directory, Windows Server, Identity Management,Enterprise101]
style: fill
color: info
description: This guide details the deployment of a Domain Controller, the foundational "brain" of our enterprise lab. It covers the installation of **Active Directory Domain Services (AD DS)**, static IP configuration, and the setup of critical infrastructure like **DNS and DHCP**.
---

# The Domain Core: Deploying Windows Server 2025 and Active Directory Services

In a corporate environment, **Active Directory (AD)** is the backbone of the network. Developed by Microsoft, it is a directory service that manages and organizes resources, acting as a centralized database to authenticate and authorize users and devices. For our project, this server (`project-x-dc`) will manage the `corp.project-x-dc.com` domain, providing the identity and access management necessary for all other machines in the lab.

### Why Active Directory?

AD is used to streamline network management through several key features:

*   **Centralized Resource Management:** Administrators can manage users and devices from a single location.

*   **Scalability:** It can handle environments ranging from small businesses to multinational corporations.

*   **Group Policy Management:** Enables the enforcement of security settings and software updates across the entire network.

*   **Security Framework:** Uses robust protocols like **Kerberos and LDAP** to verify identities.

![Image Placeholder: Active Directory Logical Structure (Forests, Trees, Domains)](https://via.placeholder.com/800x400?text=Active+Directory+Core+Concepts+Diagram)

---

### Active Directory Core Concepts

To effectively manage an enterprise network, it is vital to understand the logical structure of Active Directory. The sources define several core concepts that govern how AD operates:

*   **Domains:** A logical grouping of objects, such as users and devices, that share the same database and security policies. In this project, our domain is **corp.project-x-dc.com**.

*   **Domain Controllers (DCs):** These are the servers that host the Active Directory database and perform critical tasks like **authentication, authorization, and replication**.

*   **Organizational Units (OUs):** Containers within a domain used to organize objects logically, such as creating separate OUs for departments like HR, IT, and Finance.

*   **Objects:** Every entity within AD is considered an object, including users, computers, printers, and groups.

*   **Groups:** Used to manage collections of objects. **Security Groups** are used for managing resource permissions, while **Distribution Groups** are primarily used for email.

*   **Forests and Trees:** A **forest** is the highest-level container, encompassing multiple domains that share a common schema. A **tree** is a hierarchy of those domains within the forest.

*   **Global Catalog (GC):** A distributed data repository that provides information about all objects in the forest, allowing for faster lookups.

*   **Trust Relationships:** These enable users in one domain to access resources located in a different domain.

![Image Placeholder: Active Directory Logical Structure (Forests, Trees, Domains)](https://via.placeholder.com/800x400?text=Active+Directory+Core+Concepts+Diagram)

---

### Step 1: Installing Windows Server 2025

Before we can configure AD, we must install the operating system.

1.  Boot the VM using the Windows Server 2025 ISO.

2.  Select **"Install Windows 11"** (the installer interface version) and choose the **"Desktop Experience"** to ensure you have a graphical user interface.

3.  Create a partition on the unallocated space and install the OS on the largest partition.

4.  Set a strong Administrator password (e.g., `@Deeboodah1!`).

**Pro-Tip:** Once logged in, look up "Settings" and change the **Screen Timeout** to "Never" to prevent the server from signing you out every 5 minutes during configuration.

---

### Step 2: Assigning a Static IP Address

A Domain Controller must have a fixed address so that other clients can always find it for authentication and DNS.

1. Open the **Control Panel** and navigate to **Network and Sharing Center > Change adapter settings**.

2. Right-click the Ethernet adapter and select **Properties > IPv4 Properties**.

3. Configure the following static settings:
    *   **IP Address:** `10.0.0.5`
    *   **Subnet Mask:** `255.255.255.0`
    *   **Default Gateway:** `10.0.0.1`.

![Image Placeholder: Windows Static IP Configuration Window](https://via.placeholder.com/800x400?text=Assigning+Static+IP+Address)

---

### Step 3: Promoting to a Domain Controller

Promotion turns a standalone server into a **Domain Controller (DC)**—a server that hosts the AD database and performs authentication.

1. In **Server Manager**, select **Add roles and features**.

2. Install the following roles: **Active Directory Domain Services, DHCP Server, and DNS Server**.

3. After installation, click the notification flag and select **"Promote this server to a domain controller"**.

4. Choose **"Add a new forest"** and name the root domain `corp.project-x-dc.com`.

5. Follow the prompts, keeping the NetBIOS name as `CORP`, and allow the server to restart.

---

### Step 4: Configuring DNS and DHCP

To ensure the network is functional and has internet access, we must configure support services.

**DNS Forwarders:**

To allow the server to resolve external websites (like google.com), go to **DNS Manager**, right-click the server, and under **Forwarders**, add the Google DNS address: `8.8.8.8`.

**DHCP Scope:**

To automatically assign IP addresses to new clients in the lab:

1. Open **DHCP Manager** and create a **New Scope** named `project-x-scope`.

2. Set the **Start IP** to `10.0.0.100` and the **End IP** to `10.0.0.200`.

3. Set the Router (Default Gateway) to `10.0.0.1`.

![Image Placeholder: DHCP Scope Setup Wizard](https://via.placeholder.com/800x400?text=Configuring+DHCP+Scope+Range)

---

### Step 5: Adding User Accounts

Finally, create the "users" of your simulated corporation:

1. Navigate to **Tools > Active Directory Users and Computers**.

2. Right-click the **Users** container and select **New > User**.

3. Input the user details and set a password, ensuring you select **"User cannot change password"** for this lab environment.

---

> **Security Note:** Active Directory is a prime target for attackers. Common threats include **Credential Theft** (e.g., Kerberoasting) and **Lateral Movement**, where attackers move through the network identifying valuable targets. Always take a **Snapshot** of your VM once this configuration is finished to preserve your progress!.


