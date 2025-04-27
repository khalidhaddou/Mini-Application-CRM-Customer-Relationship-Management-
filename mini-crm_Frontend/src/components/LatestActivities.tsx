import { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from "@mui/material";
import API from "../services/api";
import moment from "moment";
import "moment/locale/fr"; // ⬅️ pour activer le français

interface Historique {
  id: number;
  action: string;
  description: string;
  created_at: string;
}

const LatestActivities: React.FC = () => {
  const [historique, setHistorique] = useState<Historique[]>([]);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistorique(response.data.history);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
      }
    };

    fetchHistorique();
  }, []);

  // important pour que moment utilise le français
  moment.locale('fr');

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Historique
        </Typography>
        <List>
          {historique.map((item, index) => (
            <div key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    {item.action.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      {moment(item.created_at).fromNow()} {/* ⬅️ ici moment */}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" component="span">
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
              {index !== historique.length - 1 && <Divider variant="inset" component="li" />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default LatestActivities;
