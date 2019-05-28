---
title: KMS服务搭建与配置
categories: 服务端
abbrlink: d29b6796
date: 2018-07-17 00:00:00
---

> vlmcsd 是由 C 语言编写的一款 KMS 模拟器，它可以运行在几乎任何系统中，比如：Linux、Android、FreeBSD、Solaris、Minix、Mac OS、iOS、Windows。

## 准备

- 一台 CentOS 7 64 位的服务器（这里是我的服务器）
- 服务器需要放行 KMS 默认的 TCP 1688 端口
- vlmcsd 源文件：https://github.com/Wind4/vlmcsd/releases/download/svn1111/binaries.tar.gz

## 开始

1. 根据使用的设备选择相应的程序，这里我使用的 CentOS 7 64 位服务器，所以从下载好的源文件找到 binariesLinuxintelglibc 目录中的 vlmcsd-x64-glibc（注意：这里的 x86 和 x64 一定要根据机器的配置来选择）
2. 将 vlmcsd-x64-glibc 上传到机器的 /data 目录下，并改名为 vlmcsd ，再使用下面命令给 vlmcsd 加执行权限，然后尝试执行。
   ```
   chmod u+x vlmcsd
   ./vlmcsd
   ```
   **如果执行 vlmcsd 显示类似下面的结果，那么 1688 端口可能被占用：**
   ```
   [root@centos7 ~]# ./vlmcsd
   Warning: [::]:1688: Address already in use
   Warning: 0.0.0.0:1688: Address already in use
   Fatal: Could not listen on any socket.
   ```
3. 使用 ps 命令来查看执行的进程，命令如下：
   ```
   ps aux|grep vlmcsd
   ```
   **如果显示类似下面的结果，即为正常运行：**
   ```
   [root@centos7 ~]# ps aux|grep vlmcsd
   root     16336  0.0  0.0   8624   120 ?        Ss   11:01   0:00 ./vlmcsd
   root     16390  0.0  0.0 112660   976 pts/0    R+   11:03   0:00 grep --color=auto vlmcsd
   ```
4. 将 vlmcsd 添加到开机启动并记录相关日志，使用到的命令如下：
   ```
   echo "/data/vlmcsd -l /var/log/vlmcsd.log > /dev/null 2>&1" >> /etc/rc.local
   chmod +x /etc/rc.local
   ```
   ** `/data/vlmcsd` 为 vlmcsd 的位置，`/var/log/vlmcsd.log` 为日志保存的位置。**
5. 至此 vlmcsd 已经搭建完成，重启服务器测试一下 vlmcsd 进程是否启动即可。

## 搭建完成 我们测试下搭建是否成功

1. 如果在 Windows 环境下可以使用客户端测试，在 `binariesWindowsintel` 目录找到 `vlmcs-Windows-x64.exe` 文件，将其拖到 CDM 命令行中，并在后面添加以下命令测试：
   ```
   -v -l 1 kms.chenyeah.com
   ```
   ** `kms.chenyeah.com`是我搭建的 KMS 地址 你们可以替换成`ip:1688` ，`-v` 是输出详细信息，`-l 1` 表示发送 Windows 10 Enterprise G 的激活请求**
2. 看返回消息就知道是否搭建成功了

## window 激活实际操作

服务地址

```
111.231.145.199:1688
```

### 激活方法

使用管理员模式命令提示符（可以右击左下角徽标找到）,也可以在`C:WindowsSystem32cmd.exe`右击管理员运行，执行下面的命令即可自动激活：

```
slmgr /skms 111.231.145.199:1688
slmgr /ato
```

**_如果无法自动激活，需要首先要获取对应版本的 KEY 如下，然后执行下面命令激活：_**

```
slmgr /skms 111.231.145.199:1688
slmgr /ipk xxxxx-xxxxx-xxxxx-xxxxx
slmgr /ato
```

### 查询是否激活成功

电脑`win + r` 输入

```
slmgr.vbs -xpr
```

可以查询 Win10 是否激活。  
注意：企业版有 180 天有效期，但到期会自动续的 无需担心

### 免责声明

<span style="color:red">vlmcsd 服务器激活服务，仅供测试学习目的，请勿用于商业用途。</span>

### 以下为各版本 windows KEY 列表

在 Windows 批量许可版本的计算机默认情况下需要进行 KMS 验证，下面表格中是在微软官网 [KMS Client Setup Keys](https://technet.microsoft.com/en-us/library/jj612867.aspx)&nbsp;同步到的秘钥内容，大家可以根据自己的需要获取。

#### Windows 10

| 操作系统版本                      | KMS 密钥                      |
| --------------------------------- | ----------------------------- |
| Windows 10 Professional           | W269N-WFGWX-YVC9B-4J6C9-T83GX |
| Windows 10 Professional N         | MH37W-N47XK-V7XM9-C7227-GCQG9 |
| Windows 10 Enterprise             | NPPR9-FWDCX-D2C8J-H872K-2YT43 |
| Windows 10 Enterprise N           | DPH2V-TTNVB-4X9Q3-TJR4H-KHJW4 |
| Windows 10 Education              | NW6C2-QMPVW-D7KKK-3GKT6-VCFB2 |
| Windows 10 Education N            | 2WH4N-8QGBV-H22JP-CT43Q-MDWWJ |
| Windows 10 Enterprise 2015 LTSB   | WNMTR-4C88C-JK8YV-HQ7T2-76DF9 |
| Windows 10 Enterprise 2015 LTSB N | 2F77B-TNFGY-69QQF-B8YKP-D69TJ |
| Windows 10 Enterprise 2016 LTSB   | DCPHK-NFMTC-H88MJ-PFHPY-QJ4BJ |
| Windows 10 Enterprise 2016 LTSB N | QFFDN-GRT3P-VKWWX-X7T3R-8B639 |

### Windows 8.1

| 操作系统版本               | KMS 密钥                      |
| -------------------------- | ----------------------------- |
| Windows 8.1 Professional   | GCRJD-8NW9H-F2CDX-CCM8D-9D6T9 |
| Windows 8.1 Professional N | HMCNV-VVBFX-7HMBH-CTY9B-B4FXY |
| Windows 8.1 Enterprise     | MHF9N-XY6XB-WVXMC-BTDCT-MKKG7 |
| Windows 8.1 Enterprise N   | TT4HM-HN7YT-62K67-RGRQJ-JFFXW |

### Windows 8

| 操作系统版本             | KMS 密钥                      |
| ------------------------ | ----------------------------- |
| Windows 8 Professional   | NG4HW-VH26C-733KW-K6F98-J8CK4 |
| Windows 8 Professional N | XCVCF-2NXM9-723PB-MHCB7-2RYQQ |
| Windows 8 Enterprise     | 32JNW-9KQ84-P47T8-D8GGY-CWCK7 |
| Windows 8 Enterprise N   | JMNMF-RHW7P-DMY6X-RF3DR-X2BQT |

### Windows 7

| 操作系统版本             | KMS 密钥                      |
| ------------------------ | ----------------------------- |
| Windows 7 Professional   | FJ82H-XT6CR-J8D7P-XQJJ2-GPDD4 |
| Windows 7 Professional N | MRPKT-YTG23-K7D7T-X2JMM-QY7MG |
| Windows 7 Professional E | W82YF-2Q76Y-63HXB-FGJG9-GF7QX |
| Windows 7 Enterprise     | 33PXH-7Y6KF-2VJC9-XBBR8-HVTHH |
| Windows 7 Enterprise N   | YDRBP-3D83W-TY26F-D46B2-XCKRJ |
| Windows 7 Enterprise E   | C29WB-22CC8-VJ326-GHFJW-H9DH4 |

### Windows Vista

| 操作系统版本               | KMS 密钥                      |
| -------------------------- | ----------------------------- |
| Windows Vista Business     | YFKBB-PQJJV-G996G-VWGXY-2V3X8 |
| Windows Vista Business N   | HMBQG-8H2RH-C77VX-27R82-VMQBT |
| Windows Vista Enterprise   | VKK3X-68KWM-X2YGT-QR4M6-4BWMV |
| Windows Vista Enterprise N | VTC42-BM838-43QHV-84HX6-XJXKV |

### Windows Server 2016

| 操作系统版本                   | KMS 密钥                      |
| ------------------------------ | ----------------------------- |
| Windows Server 2016 Datacenter | CB7KF-BWN84-R7R2Y-793K2-8XDDG |
| Windows Server 2016 Standard   | WC2BQ-8NRM3-FDDYY-2BFGV-KHKQY |
| Windows Server 2016 Essentials | JCKRF-N37P4-C2D82-9YXRT-4M63B |

### Windows Server 2012 R2

| 操作系统版本                           | KMS 密钥                      |
| -------------------------------------- | ----------------------------- |
| Windows Server 2012 R2 Server Standard | D2N9P-3P6X9-2R39C-7RTCD-MDVJX |
| Windows Server 2012 R2 Datacenter      | W3GGN-FT8W3-Y4M27-J84CP-Q3VJ9 |
| Windows Server 2012 R2 Essentials      | KNC87-3J2TX-XB4WP-VCPJV-M4FWM |

### Windows Server 2012

| 操作系统版本                            | KMS 密钥                      |
| --------------------------------------- | ----------------------------- |
| Windows Server 2012                     | BN3D2-R7TKB-3YPBD-8DRP2-27GG4 |
| Windows Server 2012 N                   | 8N2M2-HWPGY-7PGT9-HGDD8-GVGGY |
| Windows Server 2012 Single Language     | 2WN2H-YGCQR-KFX6K-CD6TF-84YXQ |
| Windows Server 2012 Country Specific    | 4K36P-JN4VD-GDC6V-KDT89-DYFKP |
| Windows Server 2012 Server Standard     | XC9B7-NBPP2-83J2H-RHMBY-92BT4 |
| Windows Server 2012 MultiPoint Standard | HM7DN-YVMH3-46JC3-XYTG7-CYQJJ |
| Windows Server 2012 MultiPoint Premium  | XNH6W-2V9GX-RGJ4K-Y8X6F-QGJ2G |
| Windows Server 2012 Datacenter          | 48HP8-DN98B-MYWDG-T2DCC-8W83P |

### Windows Server 2008 R2

| 操作系统版本                                     | KMS 密钥                      |
| ------------------------------------------------ | ----------------------------- |
| Windows Server 2008 R2 Web                       | 6TPJF-RBVHG-WBW2R-86QPH-6RTM4 |
| Windows Server 2008 R2 HPC edition               | TT8MH-CG224-D3D7Q-498W2-9QCTX |
| Windows Server 2008 R2 Standard                  | YC6KT-GKW9T-YTKYR-T4X34-R7VHC |
| Windows Server 2008 R2 Enterprise                | 489J6-VHDMP-X63PK-3K798-CPX3Y |
| Windows Server 2008 R2 Datacenter                | 74YFP-3QFB3-KQT8W-PMXWJ-7M648 |
| Windows Server 2008 R2 for Itanium-based Systems | GT63C-RJFQ3-4GMB6-BRFB9-CB83V |

### Windows Server 2008

| 操作系统版本                                   | KMS 密钥                      |
| ---------------------------------------------- | ----------------------------- |
| Windows Web Server 2008                        | WYR28-R7TFJ-3X2YQ-YCY4H-M249D |
| Windows Server 2008 Standard                   | TM24T-X9RMF-VWXK6-X8JC9-BFGM2 |
| Windows Server 2008 Standard without Hyper-V   | W7VD6-7JFBR-RX26B-YKQ3Y-6FFFJ |
| Windows Server 2008 Enterprise                 | YQGMW-MPWTJ-34KDK-48M3W-X4Q6V |
| Windows Server 2008 Enterprise without Hyper-V | 39BXF-X8Q23-P2WWT-38T2F-G3FPG |
| Windows Server 2008 HPC                        | RCTX3-KWVHP-BR6TB-RB6DM-6X7HP |
| Windows Server 2008 Datacenter                 | 7M67G-PC374-GR742-YH8V4-TCBY3 |
| Windows Server 2008 Datacenter without Hyper-V | 22XQ2-VRXRG-P8D42-K34TD-G3QQC |
| Windows Server 2008 for Itanium-Based Systems  | 4DWFP-JF3DJ-B7DTH-78FJB-PDRHK |

## Office 激活

<p style="color:red">首先你的OFFICE必须是VOL版本，否则无法激活。</p>
找到你的office安装目录，比如`C:Program Files (x86)Microsoft OfficeOffice16`

64 位的就是`C:Program FilesMicrosoft OfficeOffice16`

office16 是 office2016，office15 就是 2013，office14 就是 2010.

然后目录对的话，该目录下面应该有个`OSPP.VBS`。

使用管理员模式命令提示符（可以右击左下角徽标找到）,也可以在`C:WindowsSystem32cmd.exe`右击管理员运行

接下来我们就 cd 到这个目录下面，例如（请更改为自己的实际安装目录）

```shell
cd "C:Program Files (x86)Microsoft OfficeOffice16"
```

然后执行注册 kms 服务器地址：

```shell
cscript ospp.vbs /sethst:kms.chenyeah.com
```

/sethst 参数就是指定 kms 服务器地址  
一般来说，“一句命令已经完成了”，但一般 office 不会马上连接 kms 服务器进行激活，所以我们额外补充一条手动激活命令：

```shell
cscript ospp.vbs /act
```

如果提示看到 successful 的字样，那么就是激活成功了，重新打开 office 就好了

# 如果遇到报错

请检查：检测 KMS 服务器是否挂了
