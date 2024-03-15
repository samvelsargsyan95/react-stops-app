import StopList from './components/StopList/StopList'
import Grid from '@mui/material/Grid';
import { stopList } from './data';

function App() {
  return (
    <>
      <Grid container justifyContent="center">
        <StopList data={stopList} />
      </Grid>
    </>
  )
}

export default App
