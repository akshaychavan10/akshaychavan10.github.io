---
title: Foundations of Virtualization
tags: [Virtualization, Virtualbox, Enterprise101]
style: fill
color: info
description: This guide explores building a secure, isolated testing environment using a Type 2 hypervisor and custom NAT Network configurations to enable cross-VM communication. It details the essential steps for provisioning virtual hardware and using snapshots to ensure a recoverable and efficient lab workflow
---

# Foundations of Virtualization: Architecting an Isolated Network with VirtualBox

Building a professional cybersecurity lab requires a controlled environment where you can simulate complex attacks and defenses without compromising your physical hardware. The foundation of this project is **VirtualBox**, a free program used to create and manage **virtual machines (VMs)**. 


**VirtualBox** is a free program that allows you to create **virtual machines (VMs)** on your existing computer. It is classified as a **Type 2 hypervisor**, meaning it runs as an application on top of a host operating system like Windows, macOS, or Linux, rather than directly on the hardware. This setup allows each VM to function as a completely separate computer with its own dedicated operating system, applications, and network settings. For cybersecurity enthusiasts, VirtualBox is an ideal tool for setting up personal labs to practice hacking skills and network configurations in a safe, isolated space.

### Understanding VirtualBox Networking

VirtualBox offers five primary networking modes to control how VMs connect to each other and the internet.

1. **NAT (Network Address Translation):** The default mode where VirtualBox acts as a middleman; the VM has internet access but remains hidden from the main network and other VMs.

2. **NAT Network:** This mode allows **multiple VMs to communicate with each other** while remaining hidden from the rest of the network. This is the setting used for this project to create a private mini-lab with internet access.

3. **Bridged Adapter:** Connects the VM directly to your physical network as a standalone device with its own IP address.

4. **Internal Network:** A fully private network isolated from the host and the internet, where only VMs on that specific network can communicate.

5. **Host-Only Adapter:** Creates a direct link between the host machine and the VM without internet access.

![VirtualBox Network Settings Overview](/assets/blogs/virtualbox.png)

### Step 1: Provisioning the NAT Network

Before creating VMs, you must establish the network infrastructure.

- Navigate to **File > Tools > Network Manager**.

- Select **NAT Networks** and click **Create**.

- At the bottom, name the network **"project-x-network"** and assign an IPv4 prefix.

- Select **Apply** to save the changes.

### Step 2: Provisioning a New Virtual Machine

To create a VM, follow these steps to ensure it meets the project's requirements:

- Navigate to **Machine > New**.

- Enter a name, choose the folder location, and select the **Type** (e.g., Microsoft Windows) and **Version**.

- **Hardware Specs:** Assign a minimum of **4 GB of RAM (4096 MB)** and **2 CPUs**.

- **Storage:** Allocate at least **50.00 GB** of Virtual Hard disk space.

- **For Windows:** Ensure you **Enable EFI**.

--Image of: --Image Placeholder: VirtualBox VM Hardware Setup

### Step 3: Configuring Storage and Network

Once the VM shell is created, you must attach the operating system and connect it to your network.

- Go to **Settings > Storage**, select the **Empty** optical drive, and click **"Choose a disk file..."** to select your downloaded **ISO**.

- Navigate to the **Network** tab, select **"NAT Network"** in the **Attached to** option, and choose **"project-x-network"** as the name.

- Select the VM and click **Start**, then press any key when prompted to enter the OS installation wizard.

### Step 4: Mastering Lab Controls

- **The Host Key:** By default, this is the **Right Ctrl** key. It allows you to release your mouse and keyboard from the VM back to the host system and access special VirtualBox features.

- **Snapshots:** A snapshot saves the exact state of a VM at a specific time, including its disk and memory. If a configuration fails, you can **Restore** the VM to a previous state. To take one, select the VM and click **Take**, then provide a descriptive title.

--Image of: --Image Placeholder: Snapshot Management Interface

### Step 5: Optimizing with Guest Additions

To enable **Full Screen mode** and improve usability, you must install **VirtualBox Guest Additions**, which are a set of drivers and system applications.

**For Windows:**

1. In the running VM, go to **Devices > Insert Guest Additions CD image...**.

2. Open **File Explorer**, navigate to **This PC**, and open the **VirtualBox Guest Additions** program.

3. Run the **VBoxWindowsAdditions** executable, follow the prompts, and **reboot** the machine.

**For Linux:**

1. Go to **Devices > Insert Guest Additions CD image...**.

2. Open the new CD image, right-click the whitespace, and select **"Open in Terminal"**.

3. Type `sudo ./VBoxLinuxAdditions.run` and enter your password.

4. Once finished, type `reboot` to restart the system.

--Image of: --Image Placeholder: Installing Guest Additions on Linux Terminal