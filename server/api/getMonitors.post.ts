// server/api/getMonitors.post.ts
export default defineEventHandler(async (event) => {
  try {
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const workerData = await response.json();

    // 构造站点数组
    const monitors = workerData.sites.map((site: any, index: number) => ({
      id: index + 1,
      friendly_name: site.name,
      url: site.url,
      status: site.status === 'up' ? 2 : 0,
      response_time: site.latency || 0,
      alltimeuptimeratio: '100.0',
      custom_uptime_ranges: '100-100-100',
    }));

    const errorCount = monitors.filter(m => m.status === 0).length;

    // 返回符合前端期望的结构（包含 code）
    return {
      code: 200,
      data: monitors,                         // 站点数组
      status: { error: errorCount, unknown: 0 }
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      code: 500,
      data: [],
      status: { error: 0, unknown: 0 },
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});
