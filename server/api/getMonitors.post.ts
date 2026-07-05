// server/api/getMonitors.post.ts
import { getCookie } from 'h3';
import { verifyJwt } from '~~/utils/jwt'; // 假设有这个工具函数，如果没有可注释掉

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const { sitePassword, siteSecretKey } = config;

    // ========== 保留原有的登录验证逻辑 ==========
    if (sitePassword && siteSecretKey) {
      const token = getCookie(event, "authToken");
      if (!token) throw new Error("Please log in first");
      const isLogin = await verifyJwt(token); // 如果 verifyJwt 找不到，可以暂时注释掉
      if (!isLogin) throw new Error("Invalid or expired token");
    }

    // ========== 从你的 Worker 获取数据 ==========
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const workerData = await response.json();

    // 假设 workerData 格式为 { lastUpdate: string, sites: [ { name, url, status, latency } ] }
    // 转换为 UptimeRobot 兼容格式，以便前端正常解析
    const monitors = workerData.sites.map((site: any, index: number) => ({
      id: index + 1,
      friendly_name: site.name,
      url: site.url,
      status: site.status === 'up' ? 2 : 0,   // 2=正常，0=故障
      response_time: site.latency || 0,
      // 以下字段为前端可能需要的占位数据（无历史记录时用）
      alltimeuptimeratio: '100.0',
      custom_uptime_ranges: '100-100-100',   // 24h, 7d, 30d 均显示 100%
    }));

    // 构造最终返回的数据结构（与原来保持一致）
    const data = {
      monitors: monitors,
      // 如果前端需要日志数据，可添加空数组，通常不影响显示
      // logs: []
    };

    return {
      code: 200,
      message: "success",
      source: "api",   // 标识数据来源
      data: data,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      source: "api",
      data: undefined,
    };
  }
});
