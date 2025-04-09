// Mihomo Party 覆写 / Clash Verge Rev 扩展脚本

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

// 覆写Basic Options
function overwriteBasicOptions(params) {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": true,
        mode: "rule",
        "log-level": "info",
        ipv6: true,
        "interface-name": "以太网",
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
                    "alpn": ["h2", "http/1.1"],
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
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

// 覆写DNS
function overwriteDns(params) {
    const dnsList = [
        "tls://223.5.5.5",
        "tls://8.8.8.8",
        "system",
    ];

    const proxyDnsList = [
        "tls://8.8.8.8",
        "tls://223.5.5.5",
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

// 覆写DNS.Fake IP Filter
function overwriteFakeIpFilter (params) {
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

// 覆写DNS.Nameserver Policy
function overwriteNameserverPolicy (params) {
    const nameserverPolicy = {
        //DNS设置:
        "dns.google": "tls://8.8.8.8",
        "dns.alidns.com": "tls://223.5.5.5",
        "doh.pub": "tls://119.29.29.29",
        
        //本机常用网页:
        //rules更新:
        "+.ruleset.skk.moe": "dns.alidns.com",
        "+.github.com": "dns.alidns.com",
        "+.github.io": "dns.alidns.com",
        "+.githubusercontent.com": "dns.alidns.com",
        //代理
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
        "+.tv.garden": "dns.google",
        "+.bttwo.me": "dns.google",
        //直连
        "+.linux.do": "dns.alidns.com",
        "+.winos.me": "dns.alidns.com",
        "+.cmdpe.com": "dns.alidns.com",
        "+.52pojie.cn": "dns.alidns.com",
        "+.pc528.net": "dns.alidns.com",
        "+.bbs.3dmgame.com": "dns.alidns.com",
        "+.bbs.rainmeter.cn": "dns.alidns.com",
        "+.masuit.net": "dns.alidns.com",
        "+.hybase.com": "dns.alidns.com",
        "+.applnn.com": "dns.alidns.com",
        "+.pan666.net": "dns.alidns.com",
        "+.youxiaohou.com": "dns.alidns.com",
        "+.netflixcookies.com": "dns.alidns.com",
        "+.haowallpaper.com": "dns.alidns.com",
        "+.cloud.189.cn": "dns.alidns.com",
        "+.alipan.com": "dns.alidns.com",
        "+.123pan.com": "dns.alidns.com",
        "+.lanzou.com": "dns.alidns.com",
        "+.pan.huang1111.cn": "dns.alidns.com",
        "+.3jihome.com": "dns.alidns.com",
        "+.boju.cc": "dns.alidns.com",
        "+.ddys.pro": "dns.alidns.com",
        "+.5wu7rv.shop": "dns.alidns.com",
        "+.m.mubai.link": "dns.alidns.com",
        "+.meta.appinn.net": "dns.alidns.com",
        "+.hifini.com": "dns.alidns.com",
        "+.v.ikanbot.com": "dns.alidns.com",
        "+.agedm.org": "dns.alidns.com",
        "+.zrys.pw": "dns.alidns.com",
        "+.my0713.com": "dns.alidns.com",
        //本机常用网页到这结束
        
        //下面用阿里DNS解析:
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
        
        //下面用系统DNS解析
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

// 覆写hosts
function overwriteHosts (params) {
    const hosts = {
        "dns.google": ["8.8.8.8", "8.8.4.4", "2001:4860:4860::8888", "2001:4860:4860::8844"],
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "doh.pub": ['119.29.29.29', '1.12.12.12'],
        "cdn.jsdelivr.net": ['cdn.jsdelivr.net.cdn.cloudflare.net']
    };
    params.hosts = hosts;
}

// 覆写Tunnel
function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "system",
        device: "tun0",
        "dns-hijack": ["any:53", "tcp://any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": false,
        // 根据自己环境来看要排除哪些网段
        "route-exclude-address": [],
    };
    params.tun = { ...tunnelOptions };
}

// 覆写代理组
function overwriteProxyGroups(params) {
    // 所有代理
    const allProxies = params["proxies"].map((e) => e.name);
    // 公共的正则片段
    const excludeTerms = "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系";
    // 包含条件：各个国家或地区的关键词
    const includeTerms = {
        HK: "(香港|HK|Hong|🇭🇰)",
        TW: "(台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳)",
        SG: "(新加坡|狮城|SG|Singapore|🇸🇬)",
        JP: "(日本|JP|Japan|🇯🇵)",
        KR: "(韩国|韓|KR|Korea|🇰🇷)",
        US: "(美国|US|United States|America|🇺🇸)",
        UK: "(英国|UK|United Kingdom|🇬🇧)",
        FR: "(法国|FR|France|🇫🇷)",
        DE: "(德国|DE|Germany|🇩🇪)"
    };
    // 合并所有国家关键词，供"其它"条件使用
    const allCountryTerms = Object.values(includeTerms).join("|");
    // 自动代理组正则表达式配置
    const autoProxyGroupRegexs = [
        { name: "HK - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE - 自动选择", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i") },
        {
            name: "其它 - 自动选择",
            regex: new RegExp(`^(?!.*(?:${allCountryTerms}|${excludeTerms})).*$`, "i")
        }
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 1800,
            tolerance: 150,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    // 手动选择代理组
    const manualProxyGroups = [
        {
            name: "HK - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png"
        },
        {
            name: "JP - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png"
        },
        {
            name: "KR - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/KR.png"
        },
        {
            name: "SG - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png"
        },
        {
            name: "US - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png"
        },
        {
            name: "UK - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/UK.png"
        },
        {
            name: "FR - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/FR.png"
        },
        {
            name: "DE - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/DE.png"
        },
        {
            name: "TW - 手动选择",
            regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/TW.png"
        }
    ];

    const manualProxyGroupsConfig = manualProxyGroups
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getManualProxiesByRegex(params, item.regex),
            icon: item.icon,
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);

    // 负载均衡策略
    // 可选值：round-robin / consistent-hashing / sticky-sessions
    // round-robin：轮询 按顺序循环使用代理列表中的节点
    // consistent-hashing：散列 根据请求的哈希值将请求分配到固定的节点
    // sticky-sessions：缓存 对「你的设备IP + 目标地址」组合计算哈希值，根据哈希值将请求分配到固定的节点 缓存 10 分钟过期
    // 默认值：consistent-hashing
    const loadBalanceStrategy = "sticky-sessions";

    const groups = [
        {
            name: "🎯 节点选择",
            type: "select",
            url: "https://cp.cloudflare.com",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Static.png",
            proxies: [
                "自动选择",
                "手动选择",
                "⚖️ 负载均衡",
                "DIRECT",
            ],
        },
        {
            name: "手动选择",
            type: "select",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Cylink.png",
            proxies: ["HK - 手动选择", "JP - 手动选择", "KR - 手动选择", "SG - 手动选择", "US - 手动选择", "UK - 手动选择", "FR - 手动选择", "DE - 手动选择", "TW - 手动选择"],
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
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png"
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
            proxies: ["🎯 节点选择", "HK - 自动选择", "JP - 自动选择", "KR - 自动选择", "SG - 自动选择", "US - 自动选择", "UK - 自动选择", "FR - 自动选择", "DE - 自动选择", "TW - 自动选择", "其它 - 自动选择"],
            // "include-all": true,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Telegram.png"
        },
        {
            name: "🤖 AIGC",
            type: "select",
            proxies: ["US - 自动选择", "🎯 节点选择", "HK - 自动选择", "JP - 自动选择", "KR - 自动选择", "SG - 自动选择", "UK - 自动选择", "FR - 自动选择", "DE - 自动选择", "TW - 自动选择", "其它 - 自动选择"],
            // "include-all": true,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png"
        },
        {
            name: "🍎 苹果服务",
            type: "select",
            proxies: ["DIRECT", "🎯 节点选择", "HK - 自动选择", "JP - 自动选择", "KR - 自动选择", "SG - 自动选择", "US - 自动选择", "UK - 自动选择", "FR - 自动选择", "DE - 自动选择", "TW - 自动选择", "其它 - 自动选择"],
            // "include-all": true,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Apple.png"
        },
        {
            name: "Ⓜ️ 微软服务",
            type: "select",
            proxies: ["DIRECT", "🎯 节点选择", "HK - 自动选择", "JP - 自动选择", "KR - 自动选择", "SG - 自动选择", "US - 自动选择", "UK - 自动选择", "FR - 自动选择", "DE - 自动选择", "TW - 自动选择", "其它 - 自动选择"],
            // "include-all": true,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Microsoft.png"
        },
    ];

    autoProxyGroups.length &&
        groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    params["proxy-groups"] = groups;
}

// 覆写规则
function overwriteRules(params) {
    
    const mypcRules = [
        // 在此添加自定义规则，优先级次于ad。例子：
        // "RULE-SET,规则name,DIRECT",
        "RULE-SET,pcdirect,DIRECT",
        "RULE-SET,pcproxy,🎯 节点选择",
        "RULE-SET,github,🎯 节点选择",
        "RULE-SET,youtube,🎯 节点选择",
        "RULE-SET,google,🎯 节点选择",
        "RULE-SET,HP,🎯 节点选择",
        "RULE-SET,Intel,🎯 节点选择",
        "RULE-SET,Gigabyt,🎯 节点选择"
    ];
    
    const customRules = [
        // 在此添加自定义规则，优先级次于ad。例子：
        // "DOMAIN,baidu.com,DIRECT",
        
        "PROCESS-NAME,PixPin.exe,REJECT",
        "PROCESS-NAME,crashpad_handler.exe,REJECT",
        
        "PROCESS-NAME,ProcessLasso.exe,REJECT",
        "PROCESS-NAME,ProcessGovernor.exe,REJECT",
        "PROCESS-NAME,bitsumsessionagent.exe,REJECT",
        
        "PROCESS-NAME,TranslucentTB.exe,REJECT",
        
        "PROCESS-NAME,eCloud.exe,DIRECT",
        
        "PROCESS-NAME,DiskInfo64.exe,REJECT",
        
        "PROCESS-NAME,FlashPad.exe,REJECT",
        
        "PROCESS-NAME,Notepad3.exe,REJECT",
        
        "PROCESS-NAME,LosslessCut.exe,REJECT",
        
        "PROCESS-NAME,Video.UI.exe,REJECT",
        
        "PROCESS-NAME,RtkAudUService64.exe,REJECT",
        
        "PROCESS-NAME,进程管理工具(支持PE)V3.0.exe,REJECT",
        
        "PROCESS-NAME,clash,DIRECT",
        
        "PROCESS-NAME,v2ray,DIRECT",
  
        "PROCESS-NAME,xray,DIRECT",
  
        "PROCESS-NAME,naive,DIRECT",
  
        "PROCESS-NAME,trojan,DIRECT",
  
        "PROCESS-NAME,trojan-go,DIRECT",
  
        "PROCESS-NAME,ss-local,DIRECT",
 
        "PROCESS-NAME,privoxy,DIRECT",
  
        "PROCESS-NAME,leaf,DIRECT",
  
        "PROCESS-NAME,Thunder,DIRECT",
  
        "PROCESS-NAME,DownloadService,DIRECT",
  
        "PROCESS-NAME,qBittorrent,DIRECT",
  
        "PROCESS-NAME,Transmission,DIRECT",
  
        "PROCESS-NAME,fdm,DIRECT",
  
        "PROCESS-NAME,aria2c,DIRECT",
  
        "PROCESS-NAME,Folx,DIRECT",
 
        "PROCESS-NAME,NetTransport,DIRECT",
  
        "PROCESS-NAME,uTorrent,DIRECT",
  
        "PROCESS-NAME,WebTorrent,DIRECT",
        
        "PROCESS-NAME,YY.exe,DIRECT",
        "PROCESS-NAME,yyexternal.exe,DIRECT",
        "PROCESS-NAME,gslbexternal.exe,DIRECT",
        "PROCESS-NAME,yyldrsvr.exe,DIRECT",
        
        "PROCESS-NAME,AliIM.exe,DIRECT",
        "PROCESS-NAME,AliRender.exe,DIRECT",
        
        "PROCESS-NAME,WeChat.exe,DIRECT",
        "PROCESS-NAME,WeChatAppEx.exe,DIRECT",
        "PROCESS-NAME,WeChatPlayer.exe,DIRECT",
        "PROCESS-NAME,WeChatUtility.exe,DIRECT",
        "PROCESS-NAME,mmcrashpad_handler64.exe,DIRECT",
        
        "PROCESS-NAME,TIM.exe,DIRECT",
        "PROCESS-NAME,TXPlatform.exe,DIRECT",
        "PROCESS-NAME,QQExternal.exe,DIRECT",
        
        "PROCESS-NAME,wpscloudsvr.exe,REJECT",
        "PROCESS-NAME,et.exe,REJECT",
        "PROCESS-NAME,wps.exe,REJECT",
        "PROCESS-NAME,wpp.exe,REJECT",
        
        "PROCESS-NAME,IObitUnlocker.exe,REJECT",
        "PROCESS-NAME,IObitUnlocker辅助器.exe,REJECT",
        
        "PROCESS-NAME,SPlayer.exe,🎯 节点选择",
        
        "PROCESS-NAME,Telegram.exe,🎯 节点选择",
        
        "PROCESS-NAME,SwitchHosts.exe,🎯 节点选择",
        
        "PROCESS-NAME,Cherry Studio.exe,🎯 节点选择"
        
        
    ];
    
    const adNonipRules = [
        "RULE-SET,reject_non_ip,REJECT",
        "RULE-SET,reject_domainset,REJECT",
        "RULE-SET,reject_non_ip_drop,REJECT-DROP",
        "RULE-SET,reject_non_ip_no_drop,REJECT",
        "RULE-SET,ZhihuAds,REJECT",
        "RULE-SET,Hijacking,REJECT",
        "RULE-SET,Privacy,DIRECT"
    ];


    const nonipRules = [
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

    const allNonipRules = [
         ...mypcRules,
         ...customRules,
         ...adNonipRules,
         ...nonipRules
    ];

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

    const rules = [
        // 非ip类规则
        ...allNonipRules,
        // ip类规则
        ...ipRules
    ];

    const ruleProviders = {
       //mypcRules:
         pcdirect: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/toney871030/clash_verge/refs/heads/master/pcdirect.txt",
            path: "./rule_set/my_ruleset/pcdirect.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"

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
         google: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Google/Google.list",
            path: "./rule_set/my_ruleset/google.txt",
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
          Gigabyt: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Gigabyte/Gigabyte.list",
            path: "./rule_set/my_ruleset/Gigabyt.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
          
        },
        // 去广告
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
        //知乎广告拦截   
        ZhihuAds: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ZhihuAds/ZhihuAds.list",
            path: "./rule_set/sukkaw_ruleset/ZhihuAds.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"  
        },
        //反劫持   
        Hijacking: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Hijacking/Hijacking.list",
            path: "./rule_set/sukkaw_ruleset/Hijacking.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"  
         },
        //隐私保护   
         Privacy: {
            type: "http",
            behavior: "classical",
            url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Privacy/Privacy.list",
            path: "./rule_set/sukkaw_ruleset/Privacy.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 静态cdn
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
        //speedtest测速
        speedtest: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/speedtest.txt",
            path: "./rule_set/sukkaw_ruleset/speedtest.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 流媒体
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
        // AIGC
        ai_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/ai.txt",
            path: "./rule_set/sukkaw_ruleset/ai_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // telegram
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
        // apple
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
        //网易音乐
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
        // microsoft
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
        // 软件更新、操作系统等大文件下载
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
        //搜狗
        },
        sogouinput_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
            path: "./rule_set/sukkaw_ruleset/sogouinput_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "🎯 节点选择"
        },
        // 内网域名和局域网 IP
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
