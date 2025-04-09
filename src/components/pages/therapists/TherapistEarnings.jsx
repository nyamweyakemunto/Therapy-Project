import React, { useState, useEffect, useRef } from 'react';
import SideBar from '../../TherapistSideBar';
import Chart from 'chart.js/auto';

// Style objects
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  timeRangeButton: {
    padding: '8px 16px',
    marginLeft: '10px',
    border: '1px solid #ddd',
    background: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  activeButton: {
    background: '#36a2eb',
    color: 'white',
    borderColor: '#36a2eb'
  },
  summaryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  summaryCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  },
  summaryTitle: {
    marginTop: '0',
    color: '#666',
    fontSize: '16px'
  },
  summaryAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '10px 0 5px'
  },
  payoutDate: {
    color: '#666',
    fontSize: '14px',
    margin: '0'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px'
  },
  chartSection: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px'
  },
  chartContainer: {
    marginTop: '20px',
    height: '300px'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableCell: {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #eee'
  },
  tableHeader: {
    background: '#f9f9f9',
    fontWeight: '500'
  },
  statusBadge: (status) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    background: status === 'completed' || status === 'paid' 
      ? '#e6f7ee' 
      : '#fff3cd',
    color: status === 'completed' || status === 'paid' 
      ? '#28a745' 
      : '#856404'
  }),
  payoutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  payoutInfo: {
    margin: '0 0 5px',
    fontSize: '16px'
  },
  payoutAmount: {
    margin: '0',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  payoutMethod: {
    fontWeight: 'normal',
    color: '#666',
    fontSize: '14px'
  },
  payoutButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginTop: '20px',
    background: '#36a2eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px'
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#dc3545'
  }
};

// Chart Component
const EarningsChart = ({ data }) => {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current || !data) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Earnings ($)',
          data: data.values,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.raw.toFixed(2);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
    
    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
};

// Sub-components
const EarningsSummary = ({ data }) => {
  return (
    <div style={styles.summaryContainer}>
      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Total Earnings</h3>
        <p style={styles.summaryAmount}>${data.totalEarnings.toFixed(2)}</p>
      </div>
      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Completed Sessions</h3>
        <p style={styles.summaryAmount}>{data.completedSessions}</p>
      </div>
      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Average per Session</h3>
        <p style={styles.summaryAmount}>${data.avgPerSession.toFixed(2)}</p>
      </div>
      <div style={styles.summaryCard}>
        <h3 style={styles.summaryTitle}>Next Payout</h3>
        <p style={styles.summaryAmount}>${data.nextPayout.toFixed(2)}</p>
        <p style={styles.payoutDate}>{data.payoutDate}</p>
      </div>
    </div>
  );
};

const SessionHistory = ({ sessions }) => {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
      <h2>Session History</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Client</th>
              <th style={styles.tableHeader}>Duration</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{session.date}</td>
                <td style={styles.tableCell}>{session.clientName}</td>
                <td style={styles.tableCell}>{session.duration} min</td>
                <td style={styles.tableCell}>{session.type}</td>
                <td style={styles.tableCell}>${session.amount.toFixed(2)}</td>
                <td style={styles.tableCell}>
                  <span style={styles.statusBadge(session.status.toLowerCase())}>
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PayoutDetails = ({ payouts }) => {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
      <h2>Payout History</h2>
      <div>
        {payouts.map((payout, index) => (
          <div key={index} style={styles.payoutItem}>
            <div>
              <h3 style={styles.payoutInfo}>Payout #{payout.id}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{payout.date}</p>
            </div>
            <div>
              <p style={styles.payoutAmount}>${payout.amount.toFixed(2)}</p>
              <p style={styles.payoutMethod}>{payout.method}</p>
            </div>
            <div>
              <span style={styles.statusBadge(payout.status.toLowerCase())}>
                {payout.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button style={styles.payoutButton}>Request Payout</button>
    </div>
  );
};

const TherapistEarnings = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [earningsData, setEarningsData] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data functions
  const getEarningsData = (range) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: {
            totalEarnings: range === 'weekly' ? 1250 : range === 'monthly' ? 5800 : 68500,
            completedSessions: range === 'weekly' ? 12 : range === 'monthly' ? 55 : 620,
            avgPerSession: range === 'weekly' ? 104.17 : range === 'monthly' ? 105.45 : 110.48,
            nextPayout: range === 'weekly' ? 850 : range === 'monthly' ? 3800 : 0,
            payoutDate: range === 'weekly' ? 'Next Friday' : range === 'monthly' ? '1st of next month' : 'N/A'
          },
          chartData: {
            labels: range === 'weekly' 
              ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
              : range === 'monthly' 
                ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            values: range === 'weekly' 
              ? [120, 190, 150, 210, 180, 250, 150] 
              : range === 'monthly' 
                ? [1200, 1450, 1650, 1500] 
                : [4500, 5200, 4800, 5500, 6000, 5800, 6200, 5900, 6300, 6500, 6100, 6000]
          },
          payouts: Array.from({ length: range === 'weekly' ? 1 : range === 'monthly' ? 2 : 12 }, (_, i) => ({
            id: `PAY-${1000 + i}`,
            date: new Date(Date.now() - i * (range === 'weekly' ? 7 : range === 'monthly' ? 14 : 30) * 86400000).toLocaleDateString(),
            amount: range === 'weekly' ? 850 : range === 'monthly' ? 2500 + Math.random() * 1000 : 4500 + Math.random() * 2000,
            method: 'Bank Transfer',
            status: 'Completed'
          }))
        });
      }, 500);
    });
  };

  const getSessionHistory = (range) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = range === 'weekly' ? 7 : range === 'monthly' ? 15 : 5;
        resolve(Array.from({ length: count }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
          clientName: `Client ${i + 1}`,
          duration: [30, 45, 60][Math.floor(Math.random() * 3)],
          type: ['Video', 'Phone', 'In-person'][Math.floor(Math.random() * 3)],
          amount: Math.random() * 100 + 50,
          status: ['Completed', 'Paid', 'Processing'][Math.floor(Math.random() * 3)]
        })));
      }, 500);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [earnings, sessions] = await Promise.all([
          getEarningsData(timeRange),
          getSessionHistory(timeRange)
        ]);
        setEarningsData(earnings);
        setSessionHistory(sessions);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (isLoading) return (
    <SideBar>
      <div style={styles.loading}>Loading earnings data...</div>
    </SideBar>
  );
  
  if (error) return (
    <SideBar>
      <div style={styles.error}>Error: {error}</div>
    </SideBar>
  );

  return (
    <SideBar>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1>My Earnings</h1>
          <div>
            <button 
              style={{
                ...styles.timeRangeButton,
                ...(timeRange === 'weekly' && styles.activeButton)
              }}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              style={{
                ...styles.timeRangeButton,
                ...(timeRange === 'monthly' && styles.activeButton)
              }}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button 
              style={{
                ...styles.timeRangeButton,
                ...(timeRange === 'yearly' && styles.activeButton)
              }}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </button>
          </div>
        </header>

        {earningsData && (
          <>
            <EarningsSummary data={earningsData.summary} />
            
            <div style={styles.content}>
              <div style={styles.chartSection}>
                <h2>Earnings Overview</h2>
                <div style={styles.chartContainer}>
                  <EarningsChart data={earningsData.chartData} />
                </div>
              </div>
              
              <div>
                <SessionHistory sessions={sessionHistory} />
                <PayoutDetails payouts={earningsData.payouts} />
              </div>
            </div>
          </>
        )}
      </div>
    </SideBar>
  );
};

export default TherapistEarnings;