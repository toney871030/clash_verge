// Mihomo Party 覆写扩展脚本

function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["COMPATIBLE"];
}

function getManualProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["COMPATIBLE"];
}

function main(params) {
    if (!params || !params.proxies || !Array.isArray(params.proxies)) {
        console.error("错误：params 或 params.proxies 无效或未定义");
        return params || {}; // 返回原始参数或空对象，避免崩溃
    }
    overwriteBasicOptions(params);
    overwriteDns(params);
    overwriteFakeIpFilter(params);
    overwriteNameserverPolicy(params);
    overwriteHosts(params);
    overwriteTunnel(params);
    overwriteProxyGroups(params);
    overwriteRules(params);
    return params;
}

// ======================= Basic Options =======================
function overwriteBasicOptions(params) {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": true,
        mode: "rule",
        "log-level": "info",
        ipv6: true,
        "interface-name": "以太网",     // 注意：Windows环境专用，macOS/Linux请自行调整
        "tcp-concurrent-users": 128,
        "keep-alive-interval": 30,
        "inbound-tfo": true,
        "outbound-tfo": true,
        "connection-pool-size": 256,
        "idle-timeout": 60,
        "find-process-mode": "strict",
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        "cipher-suites": [
            "TLS_AES_128_GCM_SHA256",
            "TLS_AES_256_GCM_SHA384",
            "TLS_CHACHA20_POLY1305_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
        ],
        sniffer: {
            enable: true,
            sniff: {
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
                TLS: {
                    ports: [443, 8443],
                    "skip-cert-verify": false,
                    alpn: ["h2", "http/1.1"],
                    "min-version": "1.2",
                    "max-version": "1.3",
                },
                QUIC: {
                    ports: [443, 8443],
                },
            },
            "skip-domain": ["Mijia Cloud", "+.push.apple.com"]
        },
    };
    Object.keys(otherOptions).forEach(key => {
        params[key] = otherOptions[key];
    });
}

// ======================= DNS 配置 =======================
function overwriteDns(params) {
    // 公开安全的DNS服务器
    const dnsList = [
        "https://223.5.5.5/dns-query",
        "https://doh.pub/dns-query",
    ];

    // 代理服务器专用的DNS服务器
    const proxyDnsList = [
        "https://dns.google/dns-query",
        "https://223.5.5.5/dns-query",
    ];

    const dnsOptions = {
        enable: true,
        "prefer-h3": true,
        "use-hosts": true,
        "use-system-hosts": true,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "respect-rules": true,
        nameserver: dnsList,
        "proxy-server-nameserver": proxyDnsList,
    };
    params.dns = { ...dnsOptions };
}

// ======================= DNS Fake IP Filter =======================
function overwriteFakeIpFilter(params) {
    const fakeIpFilter = [
        "+.+m2m",
        "+.$injections.adguard.org",
        "+.$local.adguard.org",
        "+.+bogon",
        "+.+lan",
        "+.+localdomain",
        "+.home.arpa",
        "+.10.in-addr.arpa",
        "+.16.172.in-addr.arpa",
        "+.17.172.in-addr.arpa",
        "+.18.172.in-addr.arpa",
        "+.19.172.in-addr.arpa",
        "+.20.172.in-addr.arpa",
        "+.21.172.in-addr.arpa",
        "+.22.172.in-addr.arpa",
        "+.23.172.in-addr.arpa",
        "+.24.172.in-addr.arpa",
        "+.25.172.in-addr.arpa",
        "+.26.172.in-addr.arpa",
        "+.27.172.in-addr.arpa",
        "+.28.172.in-addr.arpa",
        "+.29.172.in-addr.arpa",
        "+.30.172.in-addr.arpa",
        "+.31.172.in-addr.arpa",
        "+.168.192.in-addr.arpa",
        "+.254.169.in-addr.arpa",
        "dns.msftncsi.com",
        "*.srv.nintendo.net",
        "*.stun.playstation.net",
        "xbox.*.microsoft.com",
        "*.xboxlive.com",
        "*.turn.twilio.com",
        "*.stun.twilio.com",
        "stun.syncthing.net",
        "stun.*"
    ];
    params.dns["fake-ip-filter"] = fakeIpFilter;
}

// ======================= DNS Nameserver Policy =======================
function overwriteNameserverPolicy(params) {
    // DNS 服务器名称对应具体解析地址
    const nameserverPolicy = {
        // DNS 服务器配置
        "dns.google": "https://dns.google/dns-query",
        "dns.alidns.com": "quic://223.5.5.5:853",
        "doh.pub": "https://1.12.12.12/dns-query",

        // DNS rules 针对特定域解析走指定 DNS
        "+.ruleset.skk.moe": "dns.google",
        "+.github.com": "dns.google",
        "+.github.io": "dns.google",
        "+.githubusercontent.com": "dns.google",

        // IP DNS 监测走 Google DNS
        "+.itdog.cn": "dns.google",
        "+.ping.pe": "dns.google",
        "+.toolbox.googleapps.com": "dns.google",
        "+.ping0.cc": "dns.google",
        "+.v2rayse.com": "dns.google",

        // 代理相关域名走 Google DNS
        "+.google.com": "dns.google",
        "+.bing.com": "dns.google",
        "+.chatgpt.com": "dns.google",
        "+.youtube.com": "dns.google",
        "+.xvideos.com": "dns.google",
        "+.pornhub.com": "dns.google",
        "+.spankbang.com": "dns.google",
        "+.netflix.com": "dns.google",
        "+.wallpaperswide.com": "dns.google",
        "+.wallhaven.cc": "dns.google",
        "+.music.ydev.tech": "dns.google",
        "+.greasyfork.org": "dns.google",
        "+.sleazyfork.org": "dns.google",
        "+.oursogo.com": "dns.google",
        "+.eyny.com": "dns.google",
        "+.18comic.vip": "dns.google",
        "+.filen.io": "dns.google",
        "+.yfsp.tv": "dns.google",
        "+.sehuatang.net": "dns.google",
        "+.xhamster.com": "dns.google",

        // 直连域使用阿里DNS和 DoH 公共服务器
        "+.linux.do": ["dns.alidns.com", "doh.pub"],
        "+.winos.me": ["dns.alidns.com", "doh.pub"],
        "+.cmdpe.com": ["dns.alidns.com", "doh.pub"],
        "+.52pojie.cn": ["dns.alidns.com", "doh.pub"],
        "+.pc528.net": ["dns.alidns.com", "doh.pub"],
        "+.bbs.3dmgame.com": ["dns.alidns.com", "doh.pub"],
        "+.bbs.rainmeter.cn": ["dns.alidns.com", "doh.pub"],
        "+.masuit.net": ["dns.alidns.com", "doh.pub"],
        "+.hybase.com": ["dns.alidns.com", "doh.pub"],
        "+.applnn.com": ["dns.alidns.com", "doh.pub"],
        "+.panwiki.com": ["dns.alidns.com", "doh.pub"],
        "+.youxiaohou.com": ["dns.alidns.com", "doh.pub"],
        "+.haowallpaper.com": ["dns.alidns.com", "doh.pub"],
        "+.cloud.189.cn": ["dns.alidns.com", "doh.pub"],
        "+.alipan.com": ["dns.alidns.com", "doh.pub"],
        "+.123pan.com": ["dns.alidns.com", "doh.pub"],
        "+.lanzou.com": ["dns.alidns.com", "doh.pub"],
        "+.pan.huang1111.cn": ["dns.alidns.com", "doh.pub"],
        "+.ysxq.cc": ["dns.alidns.com", "doh.pub"],
        "+.boju.cc": ["dns.alidns.com", "doh.pub"],
        "+.ddys.pro": ["dns.alidns.com", "doh.pub"],
        "+.m.mubai.link": ["dns.alidns.com", "doh.pub"],
        "+.meta.appinn.net": ["dns.alidns.com", "doh.pub"],
        "+.hifiti.com/": ["dns.alidns.com", "doh.pub"],
        "+.v.ikanbot.com": ["dns.alidns.com", "doh.pub"],
        "+.agedm.org": ["dns.alidns.com", "doh.pub"],
        "+.82mao.com": ["dns.alidns.com", "doh.pub"],
        "+.3jihome.com": ["dns.alidns.com", "doh.pub"],
        "+.svip.ffzyplay.com": ["dns.alidns.com", "doh.pub"],

        // 阿里DNS解析范围
        "+.uc.cn": "dns.alidns.com",
        "+.alibaba.com": "dns.alidns.com",
        "*.alicdn.com": "dns.alidns.com",
        "*.ialicdn.com": "dns.alidns.com",
        "*.myalicdn.com": "dns.alidns.com",
        "*.alidns.com": "dns.alidns.com",
        "*.aliimg.com": "dns.alidns.com",
        "+.aliyun.com": "dns.alidns.com",
        "*.aliyuncs.com": "dns.alidns.com",
        "*.alikunlun.com": "dns.alidns.com",
        "*.alikunlun.net": "dns.alidns.com",
        "*.cdngslb.com": "dns.alidns.com",
        "+.alipay.com": "dns.alidns.com",
        "+.alipay.cn": "dns.alidns.com",
        "+.alipay.com.cn": "dns.alidns.com",
        "*.alipayobjects.com": "dns.alidns.com",
        "+.alibaba-inc.com": "dns.alidns.com",
        "*.alibabausercontent.com": "dns.alidns.com",
        "*.alibabadns.com": "dns.alidns.com",
        "+.alibabachengdun.com": "dns.alidns.com",
        "+.alicloudccp.com": "dns.alidns.com",
        "+.alipan.com": "dns.alidns.com",
        "+.aliyundrive.com": "dns.alidns.com",
        "+.aliyundrive.net": "dns.alidns.com",
        "+.cainiao.com": "dns.alidns.com",
        "+.cainiao.com.cn": "dns.alidns.com",
        "+.cainiaoyizhan.com": "dns.alidns.com",
        "+.guoguo-app.com": "dns.alidns.com",
        "+.etao.com": "dns.alidns.com",
        "+.yitao.com": "dns.alidns.com",
        "+.1688.com": "dns.alidns.com",
        "+.amap.com": "dns.alidns.com",
        "+.gaode.com": "dns.alidns.com",
        "+.autonavi.com": "dns.alidns.com",
        "+.dingtalk.com": "dns.alidns.com",
        "+.mxhichina.com": "dns.alidns.com",
        "+.soku.com": "dns.alidns.com",
        "+.tb.cn": "dns.alidns.com",
        "+.taobao.com": "dns.alidns.com",
        "*.taobaocdn.com": "dns.alidns.com",
        "*.tbcache.com": "dns.alidns.com",
        "+.tmall.com": "dns.alidns.com",
        "+.goofish.com": "dns.alidns.com",
        "+.xiami.com": "dns.alidns.com",
        "+.xiami.net": "dns.alidns.com",
        "*.ykimg.com": "dns.alidns.com",
        "+.youku.com": "dns.alidns.com",
        "+.tudou.com": "dns.alidns.com",
        "*.cibntv.net": "dns.alidns.com",
        "+.ele.me": "dns.alidns.com",
        "*.elemecdn.com": "dns.alidns.com",
        "+.feizhu.com": "dns.alidns.com",
        "+.taopiaopiao.com": "dns.alidns.com",
        "+.fliggy.com": "dns.alidns.com",
        "+.koubei.com": "dns.alidns.com",
        "+.mybank.cn": "dns.alidns.com",
        "+.mmstat.com": "dns.alidns.com",
        "+.uczzd.cn": "dns.alidns.com",
        "+.iconfont.cn": "dns.alidns.com",
        "+.freshhema.com": "dns.alidns.com",
        "+.hemamax.com": "dns.alidns.com",
        "+.hemaos.com": "dns.alidns.com",
        "+.hemashare.cn": "dns.alidns.com",
        "+.shyhhema.com": "dns.alidns.com",
        "+.sm.cn": "dns.alidns.com",
        "+.npmmirror.com": "dns.alidns.com",
        "+.alios.cn": "dns.alidns.com",
        "+.wandoujia.com": "dns.alidns.com",
        "+.aligames.com": "dns.alidns.com",
        "+.25pp.com": "dns.alidns.com",
        "*.aliapp.org": "dns.alidns.com",
        "+.tanx.com": "dns.alidns.com",
        "+.hellobike.com": "dns.alidns.com",
        "*.hichina.com": "dns.alidns.com",
        "*.yunos.com": "dns.alidns.com",
        "*.nlark.com": "dns.alidns.com",
        "*.yuque.com": "dns.alidns.com",
        "upos-sz-mirrorali.bilivideo.com": "dns.alidns.com",
        "upos-sz-estgoss.bilivideo.com": "dns.alidns.com",
        "ali-safety-video.acfun.cn": "dns.alidns.com",
        "*.qcloud.com": "dns.alidns.com",
        "*.gtimg.cn": "dns.alidns.com",
        "*.gtimg.com": "dns.alidns.com",
        "*.gtimg.com.cn": "dns.alidns.com",
        "*.gdtimg.com": "dns.alidns.com",
        "*.idqqimg.com": "dns.alidns.com",
        "*.udqqimg.com": "dns.alidns.com",
        "*.igamecj.com": "dns.alidns.com",
        "+.myapp.com": "dns.alidns.com",
        "*.myqcloud.com": "dns.alidns.com",
        "+.dnspod.com": "dns.alidns.com",
        "*.qpic.cn": "dns.alidns.com",
        "*.qlogo.cn": "dns.alidns.com",
        "+.qq.com": "dns.alidns.com",
        "+.qq.com.cn": "dns.alidns.com",
        "*.qqmail.com": "dns.alidns.com",
        "+.qzone.com": "dns.alidns.com",
        "*.tencent-cloud.net": "dns.alidns.com",
        "*.tencent-cloud.com": "dns.alidns.com",
        "+.tencent.com": "dns.alidns.com",
        "+.tencent.com.cn": "dns.alidns.com",
        "+.tencentmusic.com": "dns.alidns.com",
        "+.weixinbridge.com": "dns.alidns.com",
        "+.weixin.com": "dns.alidns.com",
        "+.weiyun.com": "dns.alidns.com",
        "+.soso.com": "dns.alidns.com",
        "+.sogo.com": "dns.alidns.com",
        "+.sogou.com": "dns.alidns.com",
        "*.sogoucdn.com": "dns.alidns.com",
        "*.roblox.cn": "dns.alidns.com",
        "+.robloxdev.cn": "dns.alidns.com",
        "+.wegame.com": "dns.alidns.com",
        "+.wegame.com.cn": "dns.alidns.com",
        "+.wegameplus.com": "dns.alidns.com",
        "+.cdn-go.cn": "dns.alidns.com",
        "*.tencentcs.cn": "dns.alidns.com",
        "*.qcloudimg.com": "dns.alidns.com",
        "+.dnspod.cn": "dns.alidns.com",
        "+.anticheatexpert.com": "dns.alidns.com",
        "url.cn": "dns.alidns.com",
        "*.qlivecdn.com": "dns.alidns.com",
        "*.tcdnlive.com": "dns.alidns.com",
        "*.dnsv1.com": "dns.alidns.com",
        "*.smtcdns.net": "dns.alidns.com",
        "+.coding.net": "dns.alidns.com",
        "*.codehub.cn": "dns.alidns.com",
        "tx-safety-video.acfun.cn": "dns.alidns.com",
        "acg.tv": "dns.alidns.com",
        "b23.tv": "dns.alidns.com",
        "+.bilibili.cn": "dns.alidns.com",
        "+.bilibili.com": "dns.alidns.com",
        "*.acgvideo.com": "dns.alidns.com",
        "*.bilivideo.com": "dns.alidns.com",
        "*.bilivideo.cn": "dns.alidns.com",
        "*.bilivideo.net": "dns.alidns.com",
        "*.hdslb.com": "dns.alidns.com",
        "*.biliimg.com": "dns.alidns.com",
        "*.biliapi.com": "dns.alidns.com",
        "*.biliapi.net": "dns.alidns.com",
        "+.biligame.com": "dns.alidns.com",
        "*.biligame.net": "dns.alidns.com",
        "+.bilicomic.com": "dns.alidns.com",
        "+.bilicomics.com": "dns.alidns.com",
        "*.bilicdn1.com": "dns.alidns.com",
        "+.mi.com": "dns.alidns.com",
        "+.duokan.com": "dns.alidns.com",
        "*.mi-img.com": "dns.alidns.com",
        "*.mi-idc.com": "dns.alidns.com",
        "*.xiaoaisound.com": "dns.alidns.com",
        "*.xiaomixiaoai.com": "dns.alidns.com",
        "*.mi-fds.com": "dns.alidns.com",
        "*.mifile.cn": "dns.alidns.com",
        "*.mijia.tech": "dns.alidns.com",
        "+.miui.com": "dns.alidns.com",
        "+.xiaomi.com": "dns.alidns.com",
        "+.xiaomi.cn": "dns.alidns.com",
        "+.xiaomi.net": "dns.alidns.com",
        "+.xiaomiev.com": "dns.alidns.com",
        "+.xiaomiyoupin.com": "dns.alidns.com",
        "+.bytedance.com": "dns.alidns.com",
        "*.bytecdn.cn": "dns.alidns.com",
        "*.volccdn.com": "dns.alidns.com",
        "*.toutiaoimg.com": "dns.alidns.com",
        "*.toutiaoimg.cn": "dns.alidns.com",
        "*.toutiaostatic.com": "dns.alidns.com",
        "*.toutiaovod.com": "dns.alidns.com",
        "*.toutiaocloud.com": "dns.alidns.com",
        "+.toutiaopage.com": "dns.alidns.com",
        "+.feiliao.com": "dns.alidns.com",
        "+.iesdouyin.com": "dns.alidns.com",
        "*.pstatp.com": "dns.alidns.com",
        "+.snssdk.com": "dns.alidns.com",
        "*.bytegoofy.com": "dns.alidns.com",
        "+.toutiao.com": "dns.alidns.com",
        "+.feishu.cn": "dns.alidns.com",
        "+.feishu.net": "dns.alidns.com",
        "*.feishucdn.com": "dns.alidns.com",
        "*.feishupkg.com": "dns.alidns.com",
        "+.douyin.com": "dns.alidns.com",
        "*.douyinpic.com": "dns.alidns.com",
        "*.douyinstatic.com": "dns.alidns.com",
        "*.douyincdn.com": "dns.alidns.com",
        "*.douyinliving.com": "dns.alidns.com",
        "*.douyinvod.com": "dns.alidns.com",
        "+.huoshan.com": "dns.alidns.com",
        "*.huoshanstatic.com": "dns.alidns.com",
        "+.huoshanzhibo.com": "dns.alidns.com",
        "+.ixigua.com": "dns.alidns.com",
        "*.ixiguavideo.com": "dns.alidns.com",
        "*.ixgvideo.com": "dns.alidns.com",
        "*.byted-static.com": "dns.alidns.com",
        "+.volces.com": "dns.alidns.com",
        "+.baike.com": "dns.alidns.com",
        "*.zjcdn.com": "dns.alidns.com",
        "*.zijieapi.com": "dns.alidns.com",
        "+.feelgood.cn": "dns.alidns.com",
        "*.bytetcc.com": "dns.alidns.com",
        "*.bytednsdoc.com": "dns.alidns.com",
        "*.byteimg.com": "dns.alidns.com",
        "*.byteacctimg.com": "dns.alidns.com",
        "*.ibytedapm.com": "dns.alidns.com",
        "+.oceanengine.com": "dns.alidns.com",
        "*.edge-byted.com": "dns.alidns.com",
        "*.volcvideo.com": "dns.alidns.com",
        "+.91.com": "dns.alidns.com",
        "+.hao123.com": "dns.alidns.com",
        "+.baidu.cn": "dns.alidns.com",
        "+.baidu.com": "dns.alidns.com",
        "+.iqiyi.com": "dns.alidns.com",
        "*.iqiyipic.com": "dns.alidns.com",
        "*.baidubce.com": "dns.alidns.com",
        "*.bcelive.com": "dns.alidns.com",
        "*.baiducontent.com": "dns.alidns.com",
        "*.baidustatic.com": "dns.alidns.com",
        "*.bdstatic.com": "dns.alidns.com",
        "*.bdimg.com": "dns.alidns.com",
        "*.bcebos.com": "dns.alidns.com",
        "*.baidupcs.com": "dns.alidns.com",
        "*.baidubcr.com": "dns.alidns.com",
        "*.yunjiasu-cdn.net": "dns.alidns.com",
        "+.tieba.com": "dns.alidns.com",
        "+.xiaodutv.com": "dns.alidns.com",
        "*.shifen.com": "dns.alidns.com",
        "*.jomodns.com": "dns.alidns.com",
        "*.bdydns.com": "dns.alidns.com",
        "*.jomoxc.com": "dns.alidns.com",
        "*.duapp.com": "dns.alidns.com",
        "*.antpcdn.com": "dns.alidns.com",
        "upos-sz-mirrorbd.bilivideo.com": "dns.alidns.com",
        "upos-sz-mirrorbos.bilivideo.com": "dns.alidns.com",
        "*.qhimg.com": "dns.alidns.com",
        "*.qhimgs.com": "dns.alidns.com",
        "*.qhimgs?.com": "dns.alidns.com",
        "*.qhres.com": "dns.alidns.com",
        "*.qhres2.com": "dns.alidns.com",
        "*.qhmsg.com": "dns.alidns.com",
        "*.qhstatic.com": "dns.alidns.com",
        "*.qhupdate.com": "dns.alidns.com",
        "*.qihucdn.com": "dns.alidns.com",
        "+.360.com": "dns.alidns.com",
        "+.360.cn": "dns.alidns.com",
        "+.360.net": "dns.alidns.com",
        "+.360safe.com": "dns.alidns.com",
        "*.360tpcdn.com": "dns.alidns.com",
        "+.360os.com": "dns.alidns.com",
        "*.360webcache.com": "dns.alidns.com",
        "+.360kuai.com": "dns.alidns.com",
        "+.so.com": "dns.alidns.com",
        "+.haosou.com": "dns.alidns.com",
        "+.yunpan.cn": "dns.alidns.com",
        "+.yunpan.com": "dns.alidns.com",
        "+.yunpan.com.cn": "dns.alidns.com",
        "*.qh-cdn.com": "dns.alidns.com",
        "+.baomitu.com": "dns.alidns.com",
        "+.qiku.com": "dns.alidns.com",

        // 系统内网DNS解析
        "+.securelogin.com.cn": ['system://', 'system', 'dhcp://system'],
        "captive.apple.com": ['system://', 'system', 'dhcp://system'],
        "hotspot.cslwifi.com": ['system://', 'system', 'dhcp://system'],
        "*.m2m": ['system://', 'system', 'dhcp://system'],
        "injections.adguard.org": ['system://', 'system', 'dhcp://system'],
        "local.adguard.org": ['system://', 'system', 'dhcp://system'],
        "*.bogon": ['system://', 'system', 'dhcp://system'],
        "*.home": ['system://', 'system', 'dhcp://system'],
        "instant.arubanetworks.com": ['system://', 'system', 'dhcp://system'],
        "setmeup.arubanetworks.com": ['system://', 'system', 'dhcp://system'],
        "router.asus.com": ['system://', 'system', 'dhcp://system'],
        "repeater.asus.com": ['system://', 'system', 'dhcp://system'],
        "+.asusrouter.com": ['system://', 'system', 'dhcp://system'],
        "+.routerlogin.net": ['system://', 'system', 'dhcp://system'],
        "+.routerlogin.com": ['system://', 'system', 'dhcp://system'],
        "+.tplinkwifi.net": ['system://', 'system', 'dhcp://system'],
        "+.tplogin.cn": ['system://', 'system', 'dhcp://system'],
        "+.tplinkap.net": ['system://', 'system', 'dhcp://system'],
        "+.tplinkmodem.net": ['system://', 'system', 'dhcp://system'],
        "+.tplinkplclogin.net": ['system://', 'system', 'dhcp://system'],
        "+.tplinkrepeater.net": ['system://', 'system', 'dhcp://system'],
        "*.ui.direct": ['system://', 'system', 'dhcp://system'],
        "unifi": ['system://', 'system', 'dhcp://system'],
        "*.huaweimobilewifi.com": ['system://', 'system', 'dhcp://system'],
        "*.router": ['system://', 'system', 'dhcp://system'],
        "aterm.me": ['system://', 'system', 'dhcp://system'],
        "console.gl-inet.com": ['system://', 'system', 'dhcp://system'],
        "homerouter.cpe": ['system://', 'system', 'dhcp://system'],
        "mobile.hotspot": ['system://', 'system', 'dhcp://system'],
        "ntt.setup": ['system://', 'system', 'dhcp://system'],
        "pi.hole": ['system://', 'system', 'dhcp://system'],
        "*.plex.direct": ['system://', 'system', 'dhcp://system'],
        "*.lan": ['system://', 'system', 'dhcp://system'],
        "*.localdomain": ['system://', 'system', 'dhcp://system'],
        "+.home.arpa": ['system://', 'system', 'dhcp://system'],
        "+.10.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.16.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.17.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.18.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.19.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.20.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.21.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.22.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.23.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.24.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.25.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.26.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.27.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.28.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.29.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.30.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.31.172.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.168.192.in-addr.arpa": ['system://', 'system', 'dhcp://system'],
        "+.254.169.in-addr.arpa": ['system://', 'system', 'dhcp://system']
    };
    params.dns["nameserver-policy"] = nameserverPolicy;
}

// ======================= Hosts =======================
function overwriteHosts(params) {
    const hosts = {
        "dns.google": ["8.8.8.8", "8.8.4.4", "2001:4860:4860::8888", "2001:4860:4860::8844"],
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "doh.pub": ['119.29.29.29', '1.12.12.12'],
        "cdn.jsdelivr.net": ['cdn.jsdelivr.net.cdn.cloudflare.net']
    };
    params.hosts = hosts;
}

// ======================= Tunnel =======================
function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "system",
        device: "tun0",                  // Linux/macOS 专用设备名，Windows请根据需要修改
        "dns-hijack": ["any:53", "tcp://any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": false,
        "route-exclude-address": [],    // 如需排除部分网段请填写
    };
    params.tun = { ...tunnelOptions };
}

// ======================= 代理组配置 =======================
function overwriteProxyGroups(params) {
    // 全部代理节点名称
    const allProxies = params.proxies.map(e => e.name);

    // 排除关键词正则片段
    const excludeTerms = "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系";

    // 各国家/地区关键词
    const includeTerms = {
        hk: "(香港|HK|Hong|🇭🇰)",
        tw: "(台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳)",  
        sg: "(新加坡|狮城|SG|Singapore|🇸🇬)",
        jp: "(日本|JP|Japan|🇯🇵)",
        kr: "(韩国|韓|KR|Korea|🇰🇷)",
        us: "(美国|US|United States|America|🇺🇸)",
        uk: "(英国|UK|United Kingdom|🇬🇧)",
        fr: "(法国|FR|France|🇫🇷)",
        de: "(德国|DE|Germany|🇩🇪)"
    };

    // 合并国家关键词 — 供其它组使用
    const allCountryTerms = Object.values(includeTerms).join("|");

    // 自动选择代理组正则配置
    const autoProxyGroupRegexs = [
        { name: "HK - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.hk})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.tw})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.sg})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.jp})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.kr})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.us})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.uk})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.fr})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.de})(?!.*${excludeTerms}).*$`, "i") },
        { name: "其它 - 自动选择", regex: new RegExp(`^(?!.*(?:${allCountryTerms}|${excludeTerms})).*$`, "i") }
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map(item => ({
            name: item.name,
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 1800,
            tolerance: 150,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: true,
        }))
        .filter(item => item.proxies.length > 0);

    // 手动选择代理组配置
    const manualProxyGroups = [
        { name: "HK - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.hk})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png" },
        { name: "JP - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.jp})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png" },
        { name: "KR - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.kr})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/KR.png" },
        { name: "SG - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.sg})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png" },
        { name: "US - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.us})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png" },
        { name: "UK - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.uk})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/UK.png" },
        { name: "FR - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.fr})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/FR.png" },
        { name: "DE - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.de})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/DE.png" },
        { name: "TW - 手动选择", regex: new RegExp(`^(?=.*${includeTerms.tw})(?!.*${excludeTerms}).*$`, "i"), icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/TW.png" }
    ];

    const manualProxyGroupsConfig = manualProxyGroups
        .map(item => ({
            name: item.name,
            type: "select",
            proxies: getProxiesByRegex(params, item.regex),
            icon: item.icon,
            hidden: false,
        }))
        .filter(item => item.proxies.length > 0);

    // 负载均衡策略 (可选: round-robin / consistent-hashing / sticky-sessions)
    const loadBalanceStrategy = "sticky-sessions";

    const groups = [
        {
            name: "🎯 节点选择",
            type: "select",
            url: "https://cp.cloudflare.com",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Static.png",
            proxies: ["自动选择", "手动选择", "⚖️ 负载均衡", "DIRECT"],
        },
        {
            name: "手动选择",
            type: "select",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Cylink.png",
            proxies: manualProxyGroupsConfig.map(g => g.name),
        },
        {
            name: "自动选择",
            type: "select",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png",
            proxies: ["ALL - 自动选择"],
        },
        {
            name: "⚖️ 负载均衡",
            type: "load-balance",
            url: "https://cp.cloudflare.com",
            interval: 1800,
            strategy: loadBalanceStrategy,
            proxies: allProxies,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png",
        },
        {
            name: "ALL - 自动选择",
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 1800,
            tolerance: 150,
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "✈️ 电报信息",
            type: "select",
            proxies: ["🎯 节点选择", ...autoProxyGroups.map(g => g.name), "其它 - 自动选择"],
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Telegram.png",
        },
        {
            name: "🤖 AIGC",
            type: "select",
            proxies: ["US - 自动选择", "🎯 节点选择", ...autoProxyGroups.map(g => g.name), "其它 - 自动选择"],
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png",
        },
        {
            name: "🍎 苹果服务",
            type: "select",
            proxies: ["DIRECT", "🎯 节点选择", ...autoProxyGroups.map(g => g.name), "其它 - 自动选择"],
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Apple.png",
        },
        {
            name: "Ⓜ️ 微软服务",
            type: "select",
            proxies: ["DIRECT", "🎯 节点选择", ...autoProxyGroups.map(g => g.name), "其它 - 自动选择"],
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Microsoft.png",
        },
    ];

    // 把自动选择组添加到“自动选择”组列表
    if (autoProxyGroups.length > 0) {
        groups[2].proxies.unshift(...autoProxyGroups.map(item => item.name));
    }

    // 合并自动及手动代理组到主配置中
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);

    params["proxy-groups"] = groups;
}

// ======================= 规则配置 =======================
function overwriteRules(params) {
    // PC相关规则列表
    const myPcRules = [
        "RULE-SET,OpenAI,🎯 节点选择",
        "RULE-SET,Gemini,🎯 节点选择",
        "RULE-SET,github,🎯 节点选择",
        "RULE-SET,youtube,🎯 节点选择",
        "RULE-SET,YouTubeMusic,🎯 节点选择",
        "RULE-SET,Emby,🎯 节点选择",
        "RULE-SET,Spotify,🎯 节点选择",
        "RULE-SET,Cloudflare,🎯 节点选择",
        "RULE-SET,Facebook,🎯 节点选择",
        "RULE-SET,PikPak,🎯 节点选择",
        "RULE-SET,Netflix,🎯 节点选择",
        "RULE-SET,BiliBili,DIRECT",
        "RULE-SET,google,🎯 节点选择",
        "RULE-SET,Nvidia,🎯 节点选择",
        "RULE-SET,HP,🎯 节点选择",
        "RULE-SET,Intel,🎯 节点选择",
        "RULE-SET,Gigabyte,🎯 节点选择",
        "RULE-SET,LanZouYun,DIRECT",
        "RULE-SET,CCTV,DIRECT",
        "RULE-SET,Xunlei,DIRECT",
        "RULE-SET,ChinaTelecom,DIRECT",
        "RULE-SET,WeChat,DIRECT",
        "RULE-SET,Zhihu,DIRECT",
        "RULE-SET,Baidu,DIRECT",
        "RULE-SET,BaiDuTieBa,DIRECT",
        "RULE-SET,360,DIRECT",
        "RULE-SET,pcdirect,DIRECT",
        "RULE-SET,pcproxy,🎯 节点选择",
        "RULE-SET,gfw,🎯 节点选择",
        "RULE-SET,direct,DIRECT",
        "RULE-SET,proxy,🎯 节点选择"
    ];

    // 自定义进程名规则
    const customRules = [
        "RULE-SET,pcapplications,DIRECT"
    ];

    // 去广告相关规则
    const adNonIpRules = [
        "RULE-SET,reject_non_ip,REJECT",
        "RULE-SET,reject_domainset,REJECT",
        "RULE-SET,reject_non_ip_drop,REJECT-DROP",
        "RULE-SET,reject_non_ip_no_drop,REJECT",
        "RULE-SET,ZhihuAds,REJECT",
        "RULE-SET,Hijacking,REJECT",
        "RULE-SET,Privacy,DIRECT"
    ];

    // 非IP相关规则
    const nonIpRules = [
        "RULE-SET,cdn_domainset,🎯 节点选择",
        "RULE-SET,cdn_non_ip,🎯 节点选择",
        "RULE-SET,NeteaseMusic_non_ip,DIRECT",
        "RULE-SET,stream_non_ip,US - 自动选择",
        "RULE-SET,telegram_non_ip,✈️ 电报信息",
        "RULE-SET,apple_cdn,DIRECT",
        "RULE-SET,download_domainset,🎯 节点选择",
        "RULE-SET,download_non_ip,🎯 节点选择",
        "RULE-SET,microsoft_cdn_non_ip,DIRECT",
        "RULE-SET,sogouinput_non_ip,DIRECT",
        "RULE-SET,apple_cn_non_ip,DIRECT",
        "RULE-SET,apple_services,🍎 苹果服务",
        "RULE-SET,microsoft_non_ip,Ⓜ️ 微软服务",
        "RULE-SET,ai_non_ip,🤖 AIGC",
        "RULE-SET,global_non_ip,🎯 节点选择",
        "RULE-SET,domestic_non_ip,DIRECT",
        "RULE-SET,direct_non_ip,DIRECT",
        "RULE-SET,lan_non_ip,DIRECT"
    ];

    const allNonIpRules = [...myPcRules, ...customRules, ...adNonIpRules, ...nonIpRules];

    // IP相关规则
    const ipRules = [
        "RULE-SET,reject_ip,REJECT",
        "RULE-SET,telegram_ip,✈️ 电报信息",
        "RULE-SET,NeteaseMusic_ip,DIRECT",
        "RULE-SET,stream_ip,US - 自动选择",
        "RULE-SET,lan_ip,DIRECT",
        "RULE-SET,domestic_ip,DIRECT",
        "RULE-SET,china_ip,DIRECT",
        "RULE-SET,china_ip_ipv6,DIRECT",
        "MATCH,🎯 节点选择"
    ];

    // 合成全部规则
    const rules = [...allNonIpRules, ...ipRules];

    // =================== 规则提供者配置 ===================
    const ruleProviders = {
        // PC相关规则 sets
        OpenAI: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/OpenAI/OpenAI.list",
            path: "./rule_set/my_ruleset/OpenAI.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Gemini: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Gemini/Gemini.list",
            path: "./rule_set/my_ruleset/Gemini.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        github: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/GitHub/GitHub.list",
            path: "./rule_set/my_ruleset/github.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        youtube: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTube/YouTube.list",
            path: "./rule_set/my_ruleset/youtube.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        YouTubeMusic: {
            type: "http",
            behavior: "domain",
            url:"https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTubeMusic/YouTubeMusic.list",
            path: "./rule_set/my_ruleset/YouTubeMusic.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Emby: {
            type: "http",
            behavior: "domain",
            url:"https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Emby/Emby.list",
            path: "./rule_set/my_ruleset/Emby.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
         Spotify: {
            type: "http",
            behavior: "domain",
            url:"https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Spotify/Spotify.list",
            path: "./rule_set/my_ruleset/Spotify.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Netflix: {
            type: "http",
            behavior: "domain",
            url:"https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Netflix/Netflix.list",
            path: "./rule_set/my_ruleset/Netflix.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        BiliBili: {
            type: "http",
            behavior: "domain",
            url:"https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/BiliBili/BiliBili.list",
            path: "./rule_set/my_ruleset/BiliBili.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        google: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Google/Google.list",
            path: "./rule_set/my_ruleset/google.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Cloudflare: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Cloudflare/Cloudflare.list",
            path: "./rule_set/my_ruleset/Cloudflare.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Facebook: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Facebook/Facebook.list",
            path: "./rule_set/my_ruleset/Facebook.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Python: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Python/Python.list",
            path: "./rule_set/my_ruleset/Python.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        PikPak: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/PikPak/PikPak.list",
            path: "./rule_set/my_ruleset/PikPak.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Nvidia: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Nvidia/Nvidia.list",
            path: "./rule_set/my_ruleset/Nvidia.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        HP: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/HP/HP.list",
            path: "./rule_set/my_ruleset/HP.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Intel: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Intel/Intel.list",
            path: "./rule_set/my_ruleset/Intel.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Gigabyte: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Gigabyte/Gigabyte.list",
            path: "./rule_set/my_ruleset/Gigabyte.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        pcapplications: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/toney871030/clash_verge/refs/heads/master/pcapplications.txt",
            path: "./rule_set/my_ruleset/pcapplications.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        LanZouYun: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/LanZouYun/LanZouYun.list",
            path: "./rule_set/my_ruleset/LanZouYun.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        CCTV: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/CCTV/CCTV.list",
            path: "./rule_set/my_ruleset/CCTV.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        Xunlei: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Xunlei/Xunlei.list",
            path: "./rule_set/my_ruleset/Xunlei.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        ChinaTelecom: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ChinaTelecom/ChinaTelecom.list",
            path: "./rule_set/my_ruleset/ChinaTelecom.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        WeChat: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/WeChat/WeChat.list",
            path: "./rule_set/my_ruleset/WeChat.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        Zhihu: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Zhihu/Zhihu.list",
            path: "./rule_set/my_ruleset/Zhihu.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        BaiDuTieBa: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/BaiDuTieBa/BaiDuTieBa.list",
            path: "./rule_set/my_ruleset/BaiDuTieBa.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        Baidu: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Baidu/Baidu.list",
            path: "./rule_set/my_ruleset/Baidu.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        360: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/360/360.list",
            path: "./rule_set/my_ruleset/360.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
        pcdirect: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/toney871030/clash_verge/refs/heads/master/pcdirect.txt",
            path: "./rule_set/my_ruleset/pcdirect.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },
       pcproxy: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/toney871030/clash_verge/refs/heads/master/pcproxy.txt",
            path: "./rule_set/my_ruleset/pcproxy.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },  
        gfw: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
            path: "./rule_set/my_ruleset/gfw.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        }, 
        direct: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
            path: "./rule_set/my_ruleset/direct.txt",
            interval: 43200,
            format: "text",
            proxy: "DIRECT"
        },  
        proxy: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
            path: "./rule_set/my_ruleset/proxy.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 去广告规则提供者
        reject_non_ip_no_drop: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/reject-no-drop.txt",
            path: "./rule_set/sukkaw_ruleset/reject_non_ip_no_drop.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        reject_non_ip_drop: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/reject-drop.txt",
            path: "./rule_set/sukkaw_ruleset/reject_non_ip_drop.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        reject_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        reject_domainset: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_domainset.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        reject_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        ZhihuAds: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ZhihuAds/ZhihuAds.list",
            path: "./rule_set/sukkaw_ruleset/ZhihuAds.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Hijacking: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Hijacking/Hijacking.list",
            path: "./rule_set/sukkaw_ruleset/Hijacking.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        Privacy: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Privacy/Privacy.list",
            path: "./rule_set/sukkaw_ruleset/Privacy.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 静态CDN规则
        cdn_domainset: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
            path: "./rule_set/sukkaw_ruleset/cdn_domainset.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        cdn_non_ip: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
            path: "./rule_set/sukkaw_ruleset/cdn_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // speedtest测速
        speedtest: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/speedtest.txt",
            path: "./rule_set/sukkaw_ruleset/speedtest.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 流媒体规则
        stream_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/stream.txt",
            path: "./rule_set/sukkaw_ruleset/stream_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        stream_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/stream.txt",
            path: "./rule_set/sukkaw_ruleset/stream_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // AIGC规则
        ai_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/ai.txt",
            path: "./rule_set/sukkaw_ruleset/ai_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // Telegram规则
        telegram_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/telegram.txt",
            path: "./rule_set/sukkaw_ruleset/telegram_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        telegram_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/telegram.txt",
            path: "./rule_set/sukkaw_ruleset/telegram_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // Apple 相关服务
        apple_cdn: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/apple_cdn.txt",
            path: "./rule_set/sukkaw_ruleset/apple_cdn.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        apple_services: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/apple_services.txt",
            path: "./rule_set/sukkaw_ruleset/apple_services.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        apple_cn_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/apple_cn.txt",
            path: "./rule_set/sukkaw_ruleset/apple_cn_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 网易音乐规则
        NeteaseMusic_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/neteasemusic.txt",
            path: "./rule_set/sukkaw_ruleset/NeteaseMusic_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        NeteaseMusic_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/neteasemusic.txt",
            path: "./rule_set/sukkaw_ruleset/NeteaseMusic_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // Microsoft 相关规则
        microsoft_cdn_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/microsoft_cdn.txt",
            path: "./rule_set/sukkaw_ruleset/microsoft_cdn_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        microsoft_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/microsoft.txt",
            path: "./rule_set/sukkaw_ruleset/microsoft_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 软件更新等大文件下载资源规则
        download_domainset: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/download.txt",
            path: "./rule_set/sukkaw_ruleset/download_domainset.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        download_non_ip: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/non_ip/download.txt",
            path: "./rule_set/sukkaw_ruleset/download_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 搜狗输入法规则
        sogouinput_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
            path: "./rule_set/sukkaw_ruleset/sogouinput_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 内网与局域网规则
        lan_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/lan.txt",
            path: "./rule_set/sukkaw_ruleset/lan_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        lan_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/lan.txt",
            path: "./rule_set/sukkaw_ruleset/lan_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        domestic_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/domestic.txt",
            path: "./rule_set/sukkaw_ruleset/domestic_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        direct_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/direct.txt",
            path: "./rule_set/sukkaw_ruleset/direct_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        global_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/global.txt",
            path: "./rule_set/sukkaw_ruleset/global_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        domestic_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/domestic.txt",
            path: "./rule_set/sukkaw_ruleset/domestic_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        china_ip: {
            type: "http",
            behavior: "ipcidr",
            url: "https://ruleset.skk.moe/Clash/ip/china_ip.txt",
            path: "./rule_set/sukkaw_ruleset/china_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        china_ip_ipv6: {
            type: "http",
            behavior: "ipcidr",
            url: "https://ruleset.skk.moe/Clash/ip/china_ip_ipv6.txt",
            path: "./rule_set/sukkaw_ruleset/china_ip_ipv6.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        }
    };

    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
}
