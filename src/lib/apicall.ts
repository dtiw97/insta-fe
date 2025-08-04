export default async function trpcCall(procedure: string, input?: any): Promise<any> {
  const url = `http://localhost:8787/trpc/${procedure}`;
  const isQuery = ['getPosts', 'getPostById'].includes(procedure);
  
  if (isQuery) {
    // For queries, use GET request
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${procedure}`);
    const data = await response.json();

    return data.result?.data || data;
  } else {
    // For mutations, use POST request
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Failed to call ${procedure}`);
    const data = await response.json();

    return data.result?.data || data;
  }
}