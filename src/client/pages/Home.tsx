import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ContactPage as ContactIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import DatabaseSetupGuide from '../components/DatabaseSetupGuide';
import { useHealthCheck } from '../hooks';

const Home = () => {
  const { status, stats, retry } = useHealthCheck();

  if (status === 'error') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <DatabaseSetupGuide onRetry={retry} />
      </Container>
    );
  }

  if (status === 'checking') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box textAlign="center" py={8}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Checking database connection...
          </Typography>
        </Box>
      </Container>
    );
  }

  const features = [
    {
      icon: <ContactIcon fontSize="large" color="primary" />,
      title: 'Team Directory',
      description: 'Manage your clinical team with roles, contact details, and credentials.',
      link: '/contacts',
      count: stats?.contacts || 0,
      color: 'primary' as const,
    },
    {
      icon: <TaskIcon fontSize="large" color="secondary" />,
      title: 'Clinical Tasks',
      description: 'Track patient care tasks with priorities, status workflows, and team assignments.',
      link: '/tasks',
      count: stats?.tasks || 0,
      color: 'secondary' as const,
    },
    {
      icon: <ProjectIcon fontSize="large" color="success" />,
      title: 'Care Programs',
      description: 'Coordinate care programs with team members, timelines, and progress tracking.',
      link: '/projects',
      count: stats?.projects || 0,
      color: 'success' as const,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Clinical Operations
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Coordinate patient onboarding, medication therapy, and cross-team handoffs
        </Typography>

        {stats && (stats.contacts > 0 || stats.tasks > 0 || stats.projects > 0) && (
          <Alert severity="success" sx={{ mt: 2, mb: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body2">
              Database is set up with sample data! Explore the features below.
            </Typography>
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/contacts"
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Get Started
        </Button>
      </Box>

      <Typography variant="h4" component="h2" textAlign="center" gutterBottom mb={4}>
        Overview
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Chip label={`${feature.count} items`} color={feature.color} size="small" />
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  component={RouterLink}
                  to={feature.link}
                  variant="contained"
                  color={feature.color}
                  size="medium"
                  sx={{
                    minWidth: 160,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {feature.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
