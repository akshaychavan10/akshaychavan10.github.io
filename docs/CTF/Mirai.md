---
hide:
  - navigation
---

## Mirai

![info card](/assets/htb/mirai/info_card.png)


Mirai is the easy box which have default creds to gain shell access and the sudo for root access, althrought it has some forensic challenge to find root flag.


## Enumeration

As always we start with nmap scan.

```nmap 

Starting Nmap 7.80 ( https://nmap.org ) at 2020-11-28 07:51 EST
Nmap scan report for 10.10.10.48
Host is up (0.43s latency).

PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 6.7p1 Debian 5+deb8u3 (protocol 2.0)
| ssh-hostkey: 
|   1024 aa:ef:5c:e0:8e:86:97:82:47:ff:4a:e5:40:18:90:c5 (DSA)
|   2048 e8:c1:9d:c5:43:ab:fe:61:23:3b:d7:e4:af:9b:74:18 (RSA)
|   256 b6:a0:78:38:d0:c8:10:94:8b:44:b2:ea:a0:17:42:2b (ECDSA)
|_  256 4d:68:40:f7:20:c4:e5:52:80:7a:44:38:b8:a2:a7:52 (ED25519)
53/tcp    open  domain  dnsmasq 2.76
| dns-nsid: 
|_  bind.version: dnsmasq-2.76
80/tcp    open  http    lighttpd 1.4.35
|_http-server-header: lighttpd/1.4.35
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
1285/tcp  open  upnp    Platinum UPnP 1.0.5.13 (UPnP/1.0 DLNADOC/1.50)
32400/tcp open  http    Plex Media Server httpd
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Server returned status 401 but no WWW-Authenticate header.
|_http-cors: HEAD GET POST PUT DELETE OPTIONS
|_http-title: Unauthorized
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 26.67 seconds
```

looking to nmap scan we see that there is some port open my first aproach is enumerate web service for more information gathering so head on port 80.

i checked website but it does not return anything. so i fired up burp and inspect request in burp.after inspecting the response of request i find out that it host pi-hole which is used to block ad.

![response](/assets/htb//mirai/response.png)

next step is find out if any directories. i used ffuf to fuzz directories. 

fuzz for directories got `/admin` directory which host admin panel for pi-hole

searched for default cred on google. try this cred on admin panel log in page but it does not work. 

![creds](/assets/htb//mirai/creds.png)


## Gaining Shell

after checking the GitHub repository I found out that pi-hole used a random password while setup so I cant use to login on admin panel. although I tried it on ssh and it works. get initial access to the system using ssh.

![user](assets/htb//mirai/user.png)

## Getting Root

if I know the user password first thing I check if the user can run sudo. using sudo we can run all cmd as root on the machine. get root shell using `sudo -i`

![root](/assets/htb/mirai/root.png)

to get root flag we need some forensic knowledge which i have zero experience with. 
when we cat root.txt it show `I lost my original root.txt! I think I may have a backup on my USB stick...`

so it has USB mounted on the machine. `mount` to show mounted device it show that `/dev/sdb` on `/media/usbstick.` 


check /media/usbstick it has damit.txt file which is a note from James. 

![james note](/assets/htb/mirai/damit.png)

he deleted our root.txt . now we have to recover it.i don't have experience with forensic so we just use simple `strings` on to get root.txt.

![FLAG](/assets/htb/mirai/flag.png)