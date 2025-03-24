// -------------------- 配置开始 --------------------

// 全局配置 (Global Configuration)
const globalConfig = {
  "mixed-port": 7897,            // 混合端口 (HTTP/SOCKS5)
  "geodata-mode": true,          // GEO 数据模式 (geoip.dat: true, mmdb: false)
  "tcp-concurrent": true,        // TCP 并发连接
  "unified-delay": true,         // 统一延迟显示
  "allow-lan": true,             // 允许局域网连接
  "bind-address": "*",           // 监听地址 (所有 IP)
  "find-process-mode": "strict", // 进程匹配模式 (strict, off, always)
  "ipv6": false,                // IPv6 开关

  "mode": "global",                // 运行模式 (rule, global, direct)
  "log-level": "error",           // 日志等级 (debug, info, warning, error, silent)

  // 性能调优 (Performance Tuning)
  "tcp-concurrent-users": 64,      // TCP 并发连接数
  "keep-alive-interval": 15,       // 保活心跳间隔 (秒)
  "inbound-tfo": true,            // 入站 TCP Fast Open
  "outbound-tfo": true,           // 出站 TCP Fast Open
  "interface-name": "以太网",      // 网络接口名称 (修改为实际网卡名)

  // 连接池配置 (Connection Pool)
  "connection-pool-size": 256,     // 连接池大小
  "idle-timeout": 60,              // 空闲超时时间 (秒)

  // TLS 配置 (TLS Settings)
  "tls": {
    "enable": true,               // 启用 TLS
    "skip-cert-verify": false,    // 证书验证
    "alpn": ["h2", "http/1.1"],   // ALPN 协议
    "min-version": "1.2",         // 最小 TLS 版本
    "max-version": "1.3",         // 最大 TLS 版本
    "cipher-suites": [             // TLS 密码套件
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
    ],
    "global-client-fingerprint": "chrome", // 全局客户端指纹
    "geox-url": {                    // GEO 数据 URL
      "geoip": "https://ghfast.top/https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/geoip.dat",
      "geosite": "https://github.com/Loyalsoldier/domain-list-custom/releases/latest/download/geosite.dat",
      "mmdb": "https://ghfast.top/https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb"
    }
  }
};

// 常量定义 (Constants)
const MULTIPLIER_REGEX = /(?:[4-9](?:\.5)?x)/i; // 节点名称倍数标识正则
const RULE_UPDATE_INTERVAL = 86400; // 规则更新间隔 (秒)
const TEST_URL = "https://www.gstatic.com/generate_204"; // 节点连通性测试 URL
const TEST_INTERVAL = 300; // 节点延迟测试间隔 (秒)
const TEST_TOLERANCE = 20; // 节点延迟测试容忍度 (毫秒)
const BALANCESTRATEGY = "sticky-sessions"; // 负载均衡策略 (粘性会话)

// DNS 配置 (DNS Configuration)
const DNS_CONFIG = {
  defaultDNS: ["189.29.29.29", "223.5.5.5"], // 默认 DNS
  cnDnsList: ["https//189.29.29.29/dns-query", "https://223.5.5.5/dns-query"], // 国内 DNS
  proxyDnsList: ["https://8.8.8.8/dns-query", "https://1.1.1.1/dns-query"] // 代理 DNS
};

// 高质量节点关键词 (High Quality Keywords)
const HIGH_QUALITY_KEYWORDS = [
  "家宽", "家庭宽带", "IEPL", "Iepl", "iepl",
  "IPLC", "iplc", "Iplc", "专线", "高速",
  "高级", "精品", "原生", "SVIP", "svip",
  "Svip", "VIP", "vip", "Vip", "Premium",
  "premium",
  "特殊", "特殊线路", "游戏", "Game", "game"
];
const HIGH_QUALITY_REGEX = new RegExp(HIGH_QUALITY_KEYWORDS.join("|"), "i"); // 高质量节点匹配正则

// 强制直连域名/进程 (Force Direct Domains/IP Ranges)
const forceProxyDomains = [
  "DOMAIN-SUFFIX,local,DIRECT",
  "DOMAIN-SUFFIX,localhost,DIRECT",
  "IP-CIDR,127.0.0.0/8,DIRECT",
  "IP-CIDR,172.16.0.0/12,DIRECT",
  "IP-CIDR,192.168.0.0/16,DIRECT",
  "IP-CIDR,10.0.0.0/8,DIRECT",
  "IP-CIDR,17.0.0.0/8,DIRECT",
  "IP-CIDR,100.64.0.0/10,DIRECT",
  "IP-CIDR,224.0.0.0/4,DIRECT",
  "IP-CIDR,fe80::/10,DIRECT",
  "DOMAIN-KEYWORD,pc528.net,DIRECT,no-resolve",
  "PROCESS-NAME,Folx,DIRECT",
  "PROCESS-NAME,NetTransport,DIRECT",
  "PROCESS-NAME,uTorrent,DIRECT",
  "PROCESS-NAME,Motrix,DIRECT",
  "PROCESS-NAME,pikpak,DIRECT",
  "PROCESS-NAME,xdm-app,DIRECT",
  "PROCESS-NAME,PixPin,DIRECT",
  "PROCESS-NAME,DownloadService,DIRECT",
  "PROCESS-NAME,WebTorrent,DIRECT",
  "PROCESS-NAME,Thunder,DIRECT",
  "PROCESS-NAME,eCloud,DIRECT",
  "PROCESS-NAME,ProcessLasso,DIRECT",
  "PROCESS-NAME,WeChat,DIRECT"
];



// 规则集配置 (Rule Set Configuration)
const ruleConfig = [
  { name: "广告集合", group: "广告拦截", url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt", path: "./ruleset/reject.yaml" },
  { name: "直连列表", group: "国内直连", url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt", path: "./ruleset/direct.yaml" },
  { name: "直连补充列表", group: "国内直连", url: "https://raw.githubusercontent.com/toney871030/clash_verge/master/PCDIRECT.yaml", path: "./ruleset/PCDIRECT.yaml" },
  { name: "代理列表", group: "自动选择", url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt", path: "./ruleset/proxy.yaml" },
  { name: "代理补充列表", group: "自动选择", url: "https://raw.githubusercontent.com/toney871030/clash_verge/master/PCProxy.yaml", path: "./ruleset/PCProxy.yaml" }
];

// -------------------- 函数定义 --------------------

// 过滤高质量代理节点 (Filter High Quality Proxies)
function filterHighQualityProxies(proxies) {
  if (!proxies || !Array.isArray(proxies)) return [];
  const regex = HIGH_QUALITY_REGEX;
  return proxies.filter(proxy => regex.test(proxy.name)).map(proxy => proxy.name); // 返回高质量节点名称数组
}

// 主函数 (Main Function)
function main(config) {
  try {
    const newConfig = { ...config }; // 复制配置

    // 过滤节点 (Filter proxies)
    newConfig.proxies = newConfig.proxies.filter(proxy => !MULTIPLIER_REGEX.test(proxy.name));

    // 高质量节点 (High Quality Proxies)
    const highQualityProxies = filterHighQualityProxies(newConfig.proxies);

    // 代理组 (Proxy Groups)
    const proxyGroups = [
      { name: "自动选择", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg", type: "url-test", "include-all": true, url: TEST_URL, interval: TEST_INTERVAL, tolerance: TEST_TOLERANCE, proxies: [...newConfig.proxies.map(p => p.name), ...highQualityProxies] },
      { name: "手动选择", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg", type: "select", proxies: ["自动选择", "高质量节点", "DIRECT"] },
      { name: "高质量节点", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg", type: "select", proxies: ["自动选择", "负载均衡", "DIRECT", ...highQualityProxies] },
      { name: "负载均衡", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg", type: "load-balance", "include-all": true, strategy: BALANCESTRATEGY, url: TEST_URL, interval: TEST_INTERVAL },
      { name: "国内直连", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg", type: "select", proxies: ["DIRECT"] },
      { name: "广告拦截", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg", type: "select", proxies: ["REJECT"] },
      //兜底策略组
      { name: "终则",type: "select", proxies:["自动选择","国内直连"]}
      
    ];

    // 规则 (Rules)
    const rules = [...forceProxyDomains];

    // 规则提供者 (Rule Providers)
    const ruleProviders = {};
    ruleConfig.forEach(({ name, url, group, path }) => {
      const providerKey = `${name.toLowerCase()}_rules`;
      ruleProviders[providerKey] = { type: "http", behavior: "domain", url: url, interval: RULE_UPDATE_INTERVAL, path: `./rule-providers/${providerKey}.yaml` };
      rules.push(`RULE-SET,${providerKey},${group}`);
    });

    rules.push(
      "GEOSITE,geolocation-!cn,自动选择",
      "GEOSITE,gfw,自动选择",
      "GEOSITE,onedrive,国内直连",
      "GEOSITE,microsoft@cn,国内直连",
      "GEOSITE,steam@cn,国内直连",
      "GEOSITE,category-games@cn,国内直连",
      "GEOSITE,private,国内直连",
      "GEOSITE,cn,国内直连",
      "GEOIP,private,国内直连,no-resolve",
      "GEOIP,cn,国内直连",
      "GEOIP,telegram,自动选择",
      "GEOIP,netflix,自动选择",
      "GEOIP,cloudflare,自动选择",
      "GEOIP,cloudfront,自动选择",
      "GEOIP,facebook,自动选择",
      "GEOIP,fastly,自动选择",
      "GEOIP,google,自动选择",
      "GEOIP,twitter,自动选择",
      "GEOIP,tor,自动选择",
      "MATCH,终则"
    );

    // DNS 配置 (DNS Configuration)
    const dnsConfig = {
      "enable": true,
      "listen": ":53",
      "ipv6": true,
      "prefer-h3": true,
      "use-hosts": false,
      "use-system-hosts": false,
      "respect-rules": true,
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.1/16",
      "fake-ip-filter": [
        '+.lan', '+.local', '*.arpa', '+.stun.+', 'time.*.com', 'ntp.*.com',
        '*.msftncsi.com', 'www.msftconnecttest.com', 'localhost.ptlogin2.qq.com'
      ],
      "default-nameserver": DNS_CONFIG.defaultDNS,
      "nameserver": DNS_CONFIG.cnDnsList,
      "proxy-server-nameserver": DNS_CONFIG.proxyDnsList,
      "nameserver-policy": {
        "geosite:private,cn": DNS_CONFIG.cnDnsList,
        "geosite:geolocation-!cn,gfw": DNS_CONFIG.proxyDnsList
      },
    };

    return {
      ...newConfig,
      ...globalConfig,
      "proxy-groups": proxyGroups,
      "rules": rules,
      "rule-providers": ruleProviders,
      "dns": dnsConfig
    };
  } catch (error) {
    console.error('发生错误:', error);
    return config;
  }
}

// -------------------- 配置结束 --------------------
