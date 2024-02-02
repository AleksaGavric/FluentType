import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import chartTrendline from 'chartjs-plugin-trendline';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  chartTrendline
);

interface TypingHistory {
  wpm: number;
  time: string;
}

const StatsHistory = ({ user }: { user: any }) => {
  const [history, setHistory] = useState<TypingHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/get_history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistory(data.typingHistory);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 pb-40 md:flex-row">
      <div className="m-4 flex flex-1 flex-col justify-center bg-white bg-gradient-to-r from-blue-100 to-teal-50 p-4 text-center shadow-xl md:max-h-[45vh] md:max-w-[45vw]">
        <h1 className="mb-4 text-xl font-bold">Typing History</h1>
        <div className="max-h-[40vh] overflow-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-blue-200">
                <th>Session</th>
                <th>WPM</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history
                .sort(
                  (a, b) =>
                    new Date(b.time).getTime() - new Date(a.time).getTime()
                )
                .map((session, index) => (
                  <tr key={index} className="border-b">
                    <td className="text-center">{history.length - index}</td>
                    <td className="text-center">{session.wpm}</td>
                    <td className="text-center">
                      {new Date(session.time).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="m-4 flex flex-1 flex-col justify-center bg-white bg-gradient-to-r from-teal-50 to-blue-100 p-4 text-center shadow-lg md:max-h-[50vh] md:max-w-[45vw]">
        <h2 className="mb-4 text-xl font-bold">Typing Progression</h2>
        {history ? (
          <Line
            data={{
              labels: history.map((_, index) => `${index + 1}`),
              datasets: [
                {
                  label: 'WPM',
                  data: history.map((item) => item.wpm),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                  trendlineLinear: {
                    borderColor: 'red',
                    colorMin: 'red',
                    colorMax: 'red',
                    lineStyle: 'dotted',
                    width: 2,
                  },
                } as any,
                {
                  label: 'Trendline',
                  data: [],
                  borderColor: 'red',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  pointHitRadius: 0,
                  pointHoverRadius: 0,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: true,
                  onClick: () => {},
                },
              },
            }}
          />
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </div>
  );
};

export default StatsHistory;
