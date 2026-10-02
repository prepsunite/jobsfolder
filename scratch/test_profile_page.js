async function testPage() {
  const username = 'Venkat_c_m';
  const res = await fetch(`https://leetcode.com/u/${username}/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });
  console.log('HTML status:', res.status);
  const text = await res.text();
  console.log('HTML length:', text.length);
  // Check for __NEXT_DATA__
  const match = text.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (match) {
    const nextData = JSON.parse(match[1]);
    console.log('__NEXT_DATA__ keys:', Object.keys(nextData));
    console.log('pageProps keys:', Object.keys(nextData.props?.pageProps || {}));
    console.log('pageProps queries:', Object.keys(nextData.props?.pageProps?.dehydratedState?.queries || {}));
    const queries = nextData.props?.pageProps?.dehydratedState?.queries || [];
    for (const q of queries) {
      console.log('queryKey:', q.queryKey);
      if (JSON.stringify(q).includes('recentAc') || JSON.stringify(q).includes('submission')) {
        console.log('Found submission query:', JSON.stringify(q).slice(0, 300));
      }
    }
  } else {
    console.log('No __NEXT_DATA__ found');
  }
}
testPage();
