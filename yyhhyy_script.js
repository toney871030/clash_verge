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
        "log-level": "warning",
        ipv6: false,
        "find-process-mode": "strict",
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        sniffer: {
            enable: true,
            sniff: {
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
                TLS: {
                    ports: [443, 8443],
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
        "tls://120.53.53.53",
    ];

    const proxyDnsList = [
        "tls://8.8.8.8",
        "tls://223.5.5.5",
        "tls://120.53.53.53",
    ];

    const dnsOptions = {
        enable: true,
        "prefer-h3": true,
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
        "dns.google": "tls://8.8.8.8",
        "dns.alidns.com": "tls://223.5.5.5",
        "doh.pub": "tls://120.53.53.53",
        "doh.360.cn": "tls://101.198.198.198",
        //本机常用网页
        
        //代理
        "+.google.com": "tls://8.8.8.8",
        "+.bing.com": "tls://8.8.8.8",
        "+.github.com": "tls://8.8.8.8",
        "+.githubusercontent.com": "tls://8.8.8.8",
        "+.chatgpt.com": "tls://8.8.8.8",
        "+.youtube.com": "tls://8.8.8.8",
        "+.xvideos.com": "tls://8.8.8.8",
        "+.pornhub.com": "tls://8.8.8.8",
        "+.spankbang.com": "tls://8.8.8.8",
        "+.netflix.com": "tls://8.8.8.8",
        "+.wallpaperswide.com": "tls://8.8.8.8",
        "+.wallhaven.cc": "tls://8.8.8.8",
        "+.music.ydev.tech": "tls://8.8.8.8",
        "+.greasyfork.org": "tls://8.8.8.8",
        "+.sleazyfork.org": "tls://8.8.8.8",
        "+.oursogo.com": "tls://8.8.8.8",
        "+.eyny.com": "tls://8.8.8.8",
        "+.18comic.vip": "tls://8.8.8.8",
        
        //直连
        "+.linux.do": "tls://120.53.53.53",
        "+.winos.me": "tls://120.53.53.53",
        "+.cmdpe.com": "tls://120.53.53.53",
        "+.52pojie.cn": "tls://120.53.53.53",
        "pc528.net": "tls://120.53.53.53",
        "+.bbs.3dmgame.com": "tls://120.53.53.53",
        "+.bbs.rainmeter.cn": "tls://120.53.53.53",
        "+.masuit.net": "tls://120.53.53.53",
        "+.hybase.com": "tls://120.53.53.53",
        "+.4fb.cn": "tls://120.53.53.53",
        "+.applnn.com": "tls://120.53.53.53",
        "+.pan666.net": "tls://120.53.53.53",
        "+.youxiaohou.com": "tls://120.53.53.53",
        "+.netflixcookies.com": "tls://120.53.53.53",
        "+.haowallpaper.com": "tls://120.53.53.53",
        "+.cloud.189.cn": "tls://120.53.53.53",
        "+.alipan.com": "tls://120.53.53.53",
        "+.123pan.com": "tls://120.53.53.53",
        "+.lanzou.com": "tls://120.53.53.53",
        "+.pan.huang1111.cn": "tls://120.53.53.53",
        "+.3jihome.com": "tls://120.53.53.53",
        "+.boju.cc": "tls://120.53.53.53",
        "+.ddys.pro": "tls://120.53.53.53",
        "+.5wu7rv.shop": "tls://120.53.53.53",
        "+.m.mubai.link": "tls://120.53.53.53",
        "+.meta.appinn.net": "tls://120.53.53.53",
        "+.hifini.com": "tls://120.53.53.53",
        "+.v.ikanbot.com": "tls://120.53.53.53",
        "+.agedm.org": "tls://120.53.53.53",
        //本机常用网页到这结束
        
        "+.uc.cn": "tls://223.5.5.5",
        "+.alibaba.com": "tls://223.5.5.5",
        "*.alicdn.com": "tls://223.5.5.5",
        "*.ialicdn.com": "tls://223.5.5.5",
        "*.myalicdn.com": "tls://223.5.5.5",
        "*.alidns.com": "tls://223.5.5.5",
        "*.aliimg.com": "tls://223.5.5.5",
        "+.aliyun.com": "tls://223.5.5.5",
        "*.aliyuncs.com": "tls://223.5.5.5",
        "*.alikunlun.com": "tls://223.5.5.5",
        "*.alikunlun.net": "tls://223.5.5.5",
        "*.cdngslb.com": "tls://223.5.5.5",
        "+.alipay.com": "tls://223.5.5.5",
        "+.alipay.cn": "tls://223.5.5.5",
        "+.alipay.com.cn": "tls://223.5.5.5",
        "*.alipayobjects.com": "tls://223.5.5.5",
        "+.alibaba-inc.com": "tls://223.5.5.5",
        "*.alibabausercontent.com": "tls://223.5.5.5",
        "*.alibabadns.com": "tls://223.5.5.5",
        "+.alibabachengdun.com": "tls://223.5.5.5",
        "+.alicloudccp.com": "tls://223.5.5.5",
        "+.alipan.com": "tls://223.5.5.5",
        "+.aliyundrive.com": "tls://223.5.5.5",
        "+.aliyundrive.net": "tls://223.5.5.5",
        "+.cainiao.com": "tls://223.5.5.5",
        "+.cainiao.com.cn": "tls://223.5.5.5",
        "+.cainiaoyizhan.com": "tls://223.5.5.5",
        "+.guoguo-app.com": "tls://223.5.5.5",
        "+.etao.com": "tls://223.5.5.5",
        "+.yitao.com": "tls://223.5.5.5",
        "+.1688.com": "tls://223.5.5.5",
        "+.amap.com": "tls://223.5.5.5",
        "+.gaode.com": "tls://223.5.5.5",
        "+.autonavi.com": "tls://223.5.5.5",
        "+.dingtalk.com": "tls://223.5.5.5",
        "+.mxhichina.com": "tls://223.5.5.5",
        "+.soku.com": "tls://223.5.5.5",
        "+.tb.cn": "tls://223.5.5.5",
        "+.taobao.com": "tls://223.5.5.5",
        "*.taobaocdn.com": "tls://223.5.5.5",
        "*.tbcache.com": "tls://223.5.5.5",
        "+.tmall.com": "tls://223.5.5.5",
        "+.goofish.com": "tls://223.5.5.5",
        "+.xiami.com": "tls://223.5.5.5",
        "+.xiami.net": "tls://223.5.5.5",
        "*.ykimg.com": "tls://223.5.5.5",
        "+.youku.com": "tls://223.5.5.5",
        "+.tudou.com": "tls://223.5.5.5",
        "*.cibntv.net": "tls://223.5.5.5",
        "+.ele.me": "tls://223.5.5.5",
        "*.elemecdn.com": "tls://223.5.5.5",
        "+.feizhu.com": "tls://223.5.5.5",
        "+.taopiaopiao.com": "tls://223.5.5.5",
        "+.fliggy.com": "tls://223.5.5.5",
        "+.koubei.com": "tls://223.5.5.5",
        "+.mybank.cn": "tls://223.5.5.5",
        "+.mmstat.com": "tls://223.5.5.5",
        "+.uczzd.cn": "tls://223.5.5.5",
        "+.iconfont.cn": "tls://223.5.5.5",
        "+.freshhema.com": "tls://223.5.5.5",
        "+.hemamax.com": "tls://223.5.5.5",
        "+.hemaos.com": "tls://223.5.5.5",
        "+.hemashare.cn": "tls://223.5.5.5",
        "+.shyhhema.com": "tls://223.5.5.5",
        "+.sm.cn": "tls://223.5.5.5",
        "+.npmmirror.com": "tls://223.5.5.5",
        "+.alios.cn": "tls://223.5.5.5",
        "+.wandoujia.com": "tls://223.5.5.5",
        "+.aligames.com": "tls://223.5.5.5",
        "+.25pp.com": "tls://223.5.5.5",
        "*.aliapp.org": "tls://223.5.5.5",
        "+.tanx.com": "tls://223.5.5.5",
        "+.hellobike.com": "tls://223.5.5.5",
        "*.hichina.com": "tls://223.5.5.5",
        "*.yunos.com": "tls://223.5.5.5",
        "*.nlark.com": "tls://223.5.5.5",
        "*.yuque.com": "tls://223.5.5.5",
        "upos-sz-mirrorali.bilivideo.com": "tls://223.5.5.5",
        "upos-sz-estgoss.bilivideo.com": "tls://223.5.5.5",
        "ali-safety-video.acfun.cn": "tls://223.5.5.5",
        "*.qcloud.com": "tls://223.5.5.5",
        "*.gtimg.cn": "tls://120.53.53.53",
        "*.gtimg.com": "tls://120.53.53.53",
        "*.gtimg.com.cn": "tls://120.53.53.53",
        "*.gdtimg.com": "tls://120.53.53.53",
        "*.idqqimg.com": "tls://120.53.53.53",
        "*.udqqimg.com": "tls://120.53.53.53",
        "*.igamecj.com": "tls://120.53.53.53",
        "+.myapp.com": "tls://120.53.53.53",
        "*.myqcloud.com": "tls://120.53.53.53",
        "+.dnspod.com": "tls://120.53.53.53",
        "*.qpic.cn": "tls://120.53.53.53",
        "*.qlogo.cn": "tls://120.53.53.53",
        "+.qq.com": "tls://223.5.5.5",
        "+.qq.com.cn": "tls://223.5.5.5",
        "*.qqmail.com": "tls://223.5.5.5",
        "+.qzone.com": "tls://223.5.5.5",
        "*.tencent-cloud.net": "tls://223.5.5.5",
        "*.tencent-cloud.com": "tls://223.5.5.5",
        "+.tencent.com": "tls://223.5.5.5",
        "+.tencent.com.cn": "tls://223.5.5.5",
        "+.tencentmusic.com": "tls://223.5.5.5",
        "+.weixinbridge.com": "tls://223.5.5.5",
        "+.weixin.com": "tls://223.5.5.5",
        "+.weiyun.com": "tls://223.5.5.5",
        "+.soso.com": "tls://120.53.53.53",
        "+.sogo.com": "tls://120.53.53.53",
        "+.sogou.com": "tls://120.53.53.53",
        "*.sogoucdn.com": "tls://120.53.53.53",
        "*.roblox.cn": "tls://120.53.53.53",
        "+.robloxdev.cn": "tls://120.53.53.53",
        "+.wegame.com": "tls://120.53.53.53",
        "+.wegame.com.cn": "tls://120.53.53.53",
        "+.wegameplus.com": "tls://120.53.53.53",
        "+.cdn-go.cn": "tls://120.53.53.53",
        "*.tencentcs.cn": "tls://120.53.53.53",
        "*.qcloudimg.com": "tls://120.53.53.53",
        "+.dnspod.cn": "tls://120.53.53.53",
        "+.anticheatexpert.com": "tls://120.53.53.53",
        "url.cn": "tls://120.53.53.53",
        "*.qlivecdn.com": "tls://120.53.53.53",
        "*.tcdnlive.com": "tls://120.53.53.53",
        "*.dnsv1.com": "tls://120.53.53.53",
        "*.smtcdns.net": "tls://120.53.53.53",
        "+.coding.net": "tls://120.53.53.53",
        "*.codehub.cn": "tls://120.53.53.53",
        "tx-safety-video.acfun.cn": "tls://120.53.53.53",
        "acg.tv": "tls://120.53.53.53",
        "b23.tv": "tls://120.53.53.53",
        "+.bilibili.cn": "tls://120.53.53.53",
        "+.bilibili.com": "tls://120.53.53.53",
        "*.acgvideo.com": "tls://120.53.53.53",
        "*.bilivideo.com": "tls://120.53.53.53",
        "*.bilivideo.cn": "tls://120.53.53.53",
        "*.bilivideo.net": "tls://120.53.53.53",
        "*.hdslb.com": "tls://120.53.53.53",
        "*.biliimg.com": "tls://120.53.53.53",
        "*.biliapi.com": "tls://120.53.53.53",
        "*.biliapi.net": "tls://120.53.53.53",
        "+.biligame.com": "tls://120.53.53.53",
        "*.biligame.net": "tls://120.53.53.53",
        "+.bilicomic.com": "tls://120.53.53.53",
        "+.bilicomics.com": "tls://120.53.53.53",
        "*.bilicdn1.com": "tls://120.53.53.53",
        "+.mi.com": "tls://120.53.53.53",
        "+.duokan.com": "tls://120.53.53.53",
        "*.mi-img.com": "tls://120.53.53.53",
        "*.mi-idc.com": "tls://120.53.53.53",
        "*.xiaoaisound.com": "tls://120.53.53.53",
        "*.xiaomixiaoai.com": "tls://120.53.53.53",
        "*.mi-fds.com": "tls://120.53.53.53",
        "*.mifile.cn": "tls://120.53.53.53",
        "*.mijia.tech": "tls://120.53.53.53",
        "+.miui.com": "tls://120.53.53.53",
        "+.xiaomi.com": "tls://120.53.53.53",
        "+.xiaomi.cn": "tls://120.53.53.53",
        "+.xiaomi.net": "tls://120.53.53.53",
        "+.xiaomiev.com": "tls://120.53.53.53",
        "+.xiaomiyoupin.com": "tls://120.53.53.53",
        "+.bytedance.com": "180.184.2.2",
        "*.bytecdn.cn": "180.184.2.2",
        "*.volccdn.com": "180.184.2.2",
        "*.toutiaoimg.com": "180.184.2.2",
        "*.toutiaoimg.cn": "180.184.2.2",
        "*.toutiaostatic.com": "180.184.2.2",
        "*.toutiaovod.com": "180.184.2.2",
        "*.toutiaocloud.com": "180.184.2.2",
        "+.toutiaopage.com": "180.184.2.2",
        "+.feiliao.com": "180.184.2.2",
        "+.iesdouyin.com": "180.184.2.2",
        "*.pstatp.com": "180.184.2.2",
        "+.snssdk.com": "180.184.2.2",
        "*.bytegoofy.com": "180.184.2.2",
        "+.toutiao.com": "180.184.2.2",
        "+.feishu.cn": "180.184.2.2",
        "+.feishu.net": "180.184.2.2",
        "*.feishucdn.com": "180.184.2.2",
        "*.feishupkg.com": "180.184.2.2",
        "+.douyin.com": "180.184.2.2",
        "*.douyinpic.com": "180.184.2.2",
        "*.douyinstatic.com": "180.184.2.2",
        "*.douyincdn.com": "180.184.2.2",
        "*.douyinliving.com": "180.184.2.2",
        "*.douyinvod.com": "180.184.2.2",
        "+.huoshan.com": "180.184.2.2",
        "*.huoshanstatic.com": "180.184.2.2",
        "+.huoshanzhibo.com": "180.184.2.2",
        "+.ixigua.com": "180.184.2.2",
        "*.ixiguavideo.com": "180.184.2.2",
        "*.ixgvideo.com": "180.184.2.2",
        "*.byted-static.com": "180.184.2.2",
        "+.volces.com": "180.184.2.2",
        "+.baike.com": "180.184.2.2",
        "*.zjcdn.com": "180.184.2.2",
        "*.zijieapi.com": "180.184.2.2",
        "+.feelgood.cn": "180.184.2.2",
        "*.bytetcc.com": "180.184.2.2",
        "*.bytednsdoc.com": "180.184.2.2",
        "*.byteimg.com": "180.184.2.2",
        "*.byteacctimg.com": "180.184.2.2",
        "*.ibytedapm.com": "180.184.2.2",
        "+.oceanengine.com": "180.184.2.2",
        "*.edge-byted.com": "180.184.2.2",
        "*.volcvideo.com": "180.184.2.2",
        "+.91.com": "180.76.76.76",
        "+.hao123.com": "180.76.76.76",
        "+.baidu.cn": "180.76.76.76",
        "+.baidu.com": "180.76.76.76",
        "+.iqiyi.com": "180.76.76.76",
        "*.iqiyipic.com": "180.76.76.76",
        "*.baidubce.com": "180.76.76.76",
        "*.bcelive.com": "180.76.76.76",
        "*.baiducontent.com": "180.76.76.76",
        "*.baidustatic.com": "180.76.76.76",
        "*.bdstatic.com": "180.76.76.76",
        "*.bdimg.com": "180.76.76.76",
        "*.bcebos.com": "180.76.76.76",
        "*.baidupcs.com": "180.76.76.76",
        "*.baidubcr.com": "180.76.76.76",
        "*.yunjiasu-cdn.net": "180.76.76.76",
        "+.tieba.com": "180.76.76.76",
        "+.xiaodutv.com": "180.76.76.76",
        "*.shifen.com": "180.76.76.76",
        "*.jomodns.com": "180.76.76.76",
        "*.bdydns.com": "180.76.76.76",
        "*.jomoxc.com": "180.76.76.76",
        "*.duapp.com": "180.76.76.76",
        "*.antpcdn.com": "180.76.76.76",
        "upos-sz-mirrorbd.bilivideo.com": "180.76.76.76",
        "upos-sz-mirrorbos.bilivideo.com": "180.76.76.76",
        "*.qhimg.com": "101.198.198.198",
        "*.qhimgs.com": "101.198.198.198",
        "*.qhimgs?.com": "101.198.198.198",
        "*.qhres.com": "101.198.198.198",
        "*.qhres2.com": "101.198.198.198",
        "*.qhmsg.com": "101.198.198.198",
        "*.qhstatic.com": "101.198.198.198",
        "*.qhupdate.com": "101.198.198.198",
        "*.qihucdn.com": "101.198.198.198",
        "+.360.com": "101.198.198.198",
        "+.360.cn": "101.198.198.198",
        "+.360.net": "101.198.198.198",
        "+.360safe.com": "101.198.198.198",
        "*.360tpcdn.com": "101.198.198.198",
        "+.360os.com": "101.198.198.198",
        "*.360webcache.com": "101.198.198.198",
        "+.360kuai.com": "101.198.198.198",
        "+.so.com": "101.198.198.198",
        "+.haosou.com": "101.198.198.198",
        "+.yunpan.cn": "101.198.198.198",
        "+.yunpan.com": "101.198.198.198",
        "+.yunpan.com.cn": "101.198.198.198",
        "*.qh-cdn.com": "101.198.198.198",
        "+.baomitu.com": "101.198.198.198",
        "+.qiku.com": "101.198.198.198",
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
        "doh.pub": ['120.53.53.53', '1.12.12.12'],
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
        "RULE-SET,google,🎯 节点选择"
    ];
    
    const customRules = [
        // 在此添加自定义规则，优先级次于ad。例子：
        // "DOMAIN,baidu.com,DIRECT",
        
    ];
    
    const adNonipRules = [
        "RULE-SET,reject_non_ip,REJECT",
        "RULE-SET,reject_domainset,REJECT",
        "RULE-SET,reject_non_ip_drop,REJECT-DROP",
        "RULE-SET,reject_non_ip_no_drop,REJECT"
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
        }   
    };

    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
}
