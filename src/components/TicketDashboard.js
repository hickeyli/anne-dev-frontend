import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import ticketData from '../data/tickets.json';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const BASE_URL = 'http://anne-dev-flask.eba-staidi2z.us-east-1.elasticbeanstalk.com';

const TicketDashboard = () => {
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [filteredTickets, setFilteredTickets] = useState([]);

  const assignees = ['all', 'unassigned', 'dylan', 'linda', 'liam', 'trent', 'aaron', 'gordon', 'josh'];

  useEffect(() => {
    if (selectedAssignee === 'all') {
      setFilteredTickets(ticketData.tickets);
    } else {
      setFilteredTickets(ticketData.tickets.filter(ticket => ticket.assignee === selectedAssignee));
    }
  }, [selectedAssignee]);

  const statusCounts = {
    new: filteredTickets.filter(ticket => ticket.status === 'new').length,
    open: filteredTickets.filter(ticket => ticket.status === 'open').length,
    'on hold': filteredTickets.filter(ticket => ticket.status === 'on hold').length,
    'in process': filteredTickets.filter(ticket => ticket.status === 'in process').length,
    resolved: filteredTickets.filter(ticket => ticket.status === 'resolved').length,
  };

  const priorityCounts = {
    low: filteredTickets.filter(ticket => ticket.priority === 'low').length,
    medium: filteredTickets.filter(ticket => ticket.priority === 'medium').length,
    high: filteredTickets.filter(ticket => ticket.priority === 'high').length,
  };

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const priorityChartData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        data: Object.values(priorityCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="ticket-dashboard">
      <h2>Ticket Dashboard</h2>
      <div className="assignee-tabs">
        {assignees.map((assignee) => (
          <button
            key={assignee}
            className={`assignee-tab ${selectedAssignee === assignee ? 'active' : ''}`}
            onClick={() => setSelectedAssignee(assignee)}
          >
            {assignee.charAt(0).toUpperCase() + assignee.slice(1)}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <div className="chart">
          <h3>Ticket Status</h3>
          <Pie data={statusChartData} />
        </div>
        <div className="chart">
          <h3>Ticket Priority</h3>
          <Bar
            data={priorityChartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;
