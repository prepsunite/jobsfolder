const runBatch = async () => {
  const tasks = [1, 2, 3, 4, 5].map((i) => {
    const p = {
      source_code: Buffer.from("print('test " + i + "')").toString('base64'),
      language_id: 71,
    };
    return fetch('https://ce.judge0.com/submissions/?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    }).then(async (r) => ({ status: r.status, data: await r.json() }));
  });
  const t0 = Date.now();
  const res = await Promise.all(tasks);
  console.log('Elapsed ms:', Date.now() - t0);
  console.log('Results:', res.map((r) => ({ http: r.status, desc: r.data?.status?.description })));
};
runBatch().catch(console.error);
