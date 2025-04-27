import { useEffect, useState } from "react";
import { Grid, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import API from "../../services/api";
import StatCard from "../../components/Card/StatCard";
import LatestActivities from "../../components/LatestActivities";
import { Chart } from "react-google-charts";
import moment from 'moment';

interface History {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

interface DashboardData {
  name: string;
  total_companies: number;
  total_invitations: number;
  pending_invitations: number;
  cancelled_invitations: number;
  history: History[];
  todo_list: string[];
  latest_companies: { id: number; name: string; logo: string; website: string; email: string; description: string }[];
  progress: number;
  quick_alerts: string;
  recent_notifications: string[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching the dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <Typography>Loading...</Typography>;
  }

  // Data for the cards
  const cardsData = [
    {
      title: "Number of Companies",
      value: dashboardData.total_companies.toString(),
      subtitle: "Total Registered",
      color: "#4caf50",
    },
    {
      title: "Number of Invitations Sent",
      value: dashboardData.total_invitations.toString(),
      subtitle: "All Invitations",
      color: "#ff5722",
    },
    {
      title: "Number of Pending Invitations",
      value: dashboardData.pending_invitations.toString(),
      subtitle: "Pending",
      color: "#2196f3",
    },
  ];

  // Data for the Google Chart
  const chartData = [
    ["Date", "Actions"],
    ...dashboardData.history.map(h => [moment(h.created_at).format('DD/MM'), 1]),
  ];

  const chartOptions = {
    title: "Action Evolution",
    curveType: "function",
    legend: { position: "bottom" },
  };

  return (
    <div className="right-content">
      {/* Welcome Message */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Hello {dashboardData.name} 👋
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Chart and History */}
      <Grid container spacing={3} mt={1}>
  <Grid item xs={12} md={6} sx={{ height: '800px' }}>
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Action Evolution
      </Typography>
      <Chart
        chartType="LineChart"
        width="100%"
        height="100%"  // Adapte la hauteur du graphique à la hauteur du card
        data={chartData}
        options={chartOptions}
      />
    </Card>
  </Grid>
  <Grid item xs={12} md={6} sx={{ height: '800px' }}>
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Latest Activities
      </Typography>
      <LatestActivities />
    </Card>
  </Grid>
</Grid>


      {/* Latest Created Companies */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Latest Created Companies
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Logo</strong></TableCell>
                      <TableCell><strong>Website</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.latest_companies.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell>
                          <img src={comp.logo} alt={comp.name} width="50" />
                        </TableCell>
                        <TableCell>{comp.website}</TableCell>
                        <TableCell>{comp.email}</TableCell>
                        <TableCell>{comp.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
