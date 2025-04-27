import { Card, Typography, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from "react";

// Définir les props du composant
interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    color: string;
    icon?: React.ElementType; // Permet de passer un composant d'icône personnalisé
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color, icon: Icon }) => {
    return (
        <Card
            sx={{
                height: 150,
                backgroundColor: color,
                color: "white",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 2,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                {Icon && <Icon fontSize="large" />}
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="h3" sx={{ fontWeight: "bold", marginRight: 1 }}>
                    {value}
                </Typography>
                <ArrowUpwardIcon fontSize="large" />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">{subtitle}</Typography>
            <MoreVertIcon  />
            </Box>
           
        </Card>
    );
};

export default StatCard;
