import { useEffect, useState } from 'react';

interface LogItem {
  id?: string;
  user: string;
  message: string;
  response: string;
  timestamp: string;
}

const API_BASE = (import.meta.env as any)?.VITE_SERVER_URL || 'http://localhost:3001';

export default function WhatsAppAI() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/logs`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const json = await res.json();
      setLogs(json.data || []);
    } catch (e: any) {
      setError(e?.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">WhatsApp AI Logs</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Response</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, idx) => (
                <tr key={l.id || idx} className="border-t">
                  <td className="px-4 py-2 whitespace-nowrap">{l.user}</td>
                  <td className="px-4 py-2 max-w-lg break-words">{l.message}</td>
                  <td className="px-4 py-2 max-w-lg break-words">{l.response}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
