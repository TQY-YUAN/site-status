export default defineEventHandler(async (event) => {
  try {
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const workerData = await response.json();

    // 构造符合 UptimeRobot 格式的数据
    const monitors = workerData.sites.map((site: any, index: number) => ({
      id: index + 1,
      friendly_name: site.name,
      url: site.url,
      status: site.status === 'up' ? 2 : 0,
      type: 1, // HTTP
      interval: 30,
      // 无历史数据，提供占位
      logs: [], // 或构造一些示例日志
      custom_uptime_ranges: '100-100-100', // 24h,7d,30d 全部 100%
    }));

    // 直接返回 UptimeRobot 格式
    return {
      monitors: monitors,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      monitors: [],
    };
  }
});
