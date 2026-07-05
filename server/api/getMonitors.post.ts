// server/api/getMonitors.post.ts
export default defineEventHandler(async (event) => {
  try {
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const workerData = await response.json();

    // 转换为 UptimeRobot 格式的 monitors 数组
    const monitors = workerData.sites.map((site: any, index: number) => ({
      id: index + 1,
      friendly_name: site.name,
      url: site.url,
      status: site.status === 'up' ? 2 : 0,
      response_time: site.latency || 0,
      alltimeuptimeratio: '100.0',
      custom_uptime_ranges: '100-100-100',
    }));

    // 统计故障数量（status=0）
    const errorCount = monitors.filter(m => m.status === 0).length;
    // 没有未知状态
    const unknownCount = 0;

    // 返回与原始 formatSiteData 一致的结构
    return {
      code: 200,
      message: "success",
      source: "api",
      data: {
        monitors,
        status: {
          error: errorCount,
          unknown: unknownCount,
        },
      },
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
