import { Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { SvgIconComponent } from '@mui/icons-material';

interface CallToActionProps {
  heroIcon?: SvgIconComponent;
  icon?: SvgIconComponent;
  title: string;
  subtitle: string;
  url?: string;
  buttonName?: string;
}

const CallToAction = ({
  heroIcon: HeroIcon,
  icon: Icon = AddCircleOutlineIcon,
  title,
  subtitle,
  url,
  buttonName,
}: CallToActionProps) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      bgcolor: 'background.paper',
      boxShadow: 3,
      transition: '0.3s',
      '&:hover': {
        boxShadow: 6,
        bgcolor: 'background.default',
      },
    }}
  >
    <CardContent>
      <Grid container direction="column" alignItems="center" spacing={2}>
        {HeroIcon && (
          <Grid>
            <HeroIcon sx={{ fontSize: 50 }} />
          </Grid>
        )}
        <Grid>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body2">{subtitle}</Typography>
        </Grid>
        {url && (
          <Grid>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={url}
              startIcon={<Icon />}
            >
              {buttonName}
            </Button>
          </Grid>
        )}
      </Grid>
    </CardContent>
  </Card>
);

export default CallToAction;
