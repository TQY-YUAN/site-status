// server/api/getMonitors.post.ts
export default defineEventHandler(async (event) => {
  try {
    // 从你的 Worker 获取数据
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const workerData = await response.json();

    // 将 Worker 的数据转换为 UptimeRobot 格式，以便前端正常解析
    const monitors = workerData.sites.map((site: any, index: number) => ({
      id: index + 1,
      friendly_name: site.name,
      url: site.url,
      status: site.status === 'up' ? 2 : 0,   // 2=正常，0=故障
      response_time: site.latency || 0,
      // 占位数据，无历史记录时显示 100%
      alltimeuptimeratio: '100.0',
      custom_uptime_ranges: '100-100-100',
    }));

    // 返回前端期望的数据结构
    return {
      code: 200,
      message: "success",
      source: "api",
      data: {
        monitors,
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
