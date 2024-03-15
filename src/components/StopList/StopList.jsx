import MapComponent from '../Map/MapComponent';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MapIcon from '@mui/icons-material/Map';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import './StopList.scss';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  '&::before': {
    display: 'none',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const footerButtons = [
  {
    name: 'Route',
    icon: <LocalShippingIcon />
  },
  {
    name: 'Map',
    icon: <MapIcon />
  }
]

export default function StopList({ data }) {
  const [expanded, setExpanded] = useState(null);
  const [isCompleted, setIsCompleted] = useState([]);
  const [activeTab, setActiveTab] = useState('Route');

  const handleChange = (panel) => (event, newExpanded) => {
    if (panel === 0 || isCompleted.includes(panel - 1)) {
      setExpanded(newExpanded ? panel : false);
    }
  };

  const complete = (index) => {
    isCompleted.push(index)
    
    if (expanded !== data.length -1) {
      setExpanded(expanded + 1) 
    }

    if (expanded === data.length -1) {
      setExpanded(null) 
    }
  } 

  const changeActiveTab = (tab) => {
    setExpanded(null)
    setActiveTab(tab)
  }

  const listStyles = {
    width: '100%',
    bgcolor: 'white',
    height: '100%',
    overflowY: 'auto',
  }

  const locations = data.map((item) => {
    return {
      lat: item.lat, 
      lng: item.lng
    }
  })

  return (
    <Grid className="parent-cont" sx={{ my: 2, height: '80vh' }}>
      {
        activeTab === 'Route' 
          ?
            <Paper
              sx={listStyles}
              elevation={3}
            >
              {
                data.map((item, index) => {
                  return (
                    <Accordion 
                      expanded={expanded === index} 
                      onChange={handleChange(index)}
                      className={
                        `list-item 
                        ${index !== 0 && !isCompleted.includes(index - 1) ? 'unactive' : ''} 
                        ${expanded === index ? 'active' : ''}`
                      }
                      key={index}
                      disabled={isCompleted.includes(index)}
                    >
                      <AccordionSummary aria-controls={`panel${index}-content`} id={`panel${index}-content`}>
                        <Grid container>
                          <Grid container justifyContent="space-between">
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5
                              }}>
                                <Box 
                                  className="list-item__num"
                                  sx={{ mr: 0.5 }} 
                                >
                                  {item?.sequence_number}
                                </Box>
                                <span className="list-item__text">{item?.street}</span>
                              </Box>
            
                              <span className="list-item__text">{item?.zip} {item?.city}</span>      
                            </Box>
            
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end'
                            }}>
                              
                              <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
                                {
                                  isCompleted.includes(index) && 
                                    <DoneAllIcon className="complete-icon" sx={{ mr: 1 }} />
                                }
                                <Box className="list-item__text">{item?.eta}</Box>
                              </Box>
                              <span className="list-item__text">{item?.time_window}</span>        
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
              
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* Navigation */}
                          <Box 
                            className="list-item__navigation"
                            sx={{ mr: 2 }}
                            onClick={() => setActiveTab('Map')}
                          >
                            <div>
                              <ShortcutIcon className="navigation-icon" />
                            </div>
                          </Box>

                          {/* Complate */}
                          <Box 
                            onClick={() => complete(index)}
                            className="list-item__complete"
                          >
                            <DoneAllIcon className="complete-icon" />
                            Complete
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )
                })
              }
            </Paper>

          : <Paper
              sx={listStyles}
              elevation={3}
            >
              <MapComponent 
                locations={locations} 
                isCompleted={isCompleted} 
                activeLocationIndex={expanded} 
              />
            </Paper>
      }
      
      <Paper
        elevation={3}
        className="footer"
      >
        <Grid container justifyContent="space-between">
          {
            footerButtons.map((item, index) => {
              return (
                <button 
                  key={index}
                  onClick={() => changeActiveTab(item.name, 'fromFooter')}
                  className={`footer__button ${  activeTab === item.name ? 'active' : '' } `}
                >
                  { item.icon }
                  <div>{ item.name }</div>
                </button>
                )
            })
          }
        </Grid>
      </Paper>
   </Grid>
  );
}