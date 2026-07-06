export default defineEventHandler(async (event) => {
  try {
    const workerUrl = 'https://site.jianc.dpdns.org/status';
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`Worker 返回错误: ${response.status}`);
    }
    const data = await response.json();
    // 直接返回 Worker 的数据，格式已经是 { data, status }
    return data;
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      data: [],
      status: { error: 0, unknown: 0 },
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});
