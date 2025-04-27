import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Paper, Typography, Box, TextField } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import API from '../../services/api';

interface Admin {
  name: string;
}

interface HistoryItem {
  id: number;
  action: string;
  description: string;
  created_at: string;
  admin?: Admin;
}

const HistoryTimeline: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    API.get('/admin/history')
      .then(res => {
        setHistory(res.data);
        setFilteredHistory(res.data); // Initially, display everything
      })
      .catch(err => console.error(err));
  }, []);

  // Filtering function
  const handleFilter = () => {
    let filtered = history;

    // Filter by action
    if (actionFilter) {
      filtered = filtered.filter(item => item.action.toLowerCase().includes(actionFilter.toLowerCase()));
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(item => moment(item.created_at).isSameOrAfter(moment(dateFilter)));
    }

    setFilteredHistory(filtered);
  };

  // Apply filtering whenever the user types
  useEffect(() => {
    handleFilter();
  }, [actionFilter, dateFilter]);

  return (
    <div className="right-content">
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Action History
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Filter by action"
            variant="outlined"
            fullWidth
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Filter by date (e.g., 2023-04-01)"
            variant="outlined"
            fullWidth
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Timeline position="alternate">
          {filteredHistory.map((item, index) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent sx={{ flex: 0.3 }}>
                <Typography variant="body2" color="textSecondary">
                  <AccessTime fontSize="small" /> {moment(item.created_at).format('DD MMM YYYY, HH:mm')}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < filteredHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" component="h1">
                    {item.action}
                  </Typography>
                  <Typography>{item.description}</Typography>
                  {item.admin?.name && (
                    <Typography variant="caption" color="text.secondary">
                      By: {item.admin.name}
                    </Typography>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </div>
  );
};

export default HistoryTimeline;
