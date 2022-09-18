import logo from './logo.svg';
import './App.css';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import data from './MOCK_DATA.json'
import { FormControl, InputAdornment, InputLabel, MenuItem, Modal, Pagination, PaginationItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  opacity: 1,
  p: 4,
};

function App() {

  const [team, setTeam] = useState([])
  const [resultData, setResultData] = useState(data)
  const [items, setItems] = useState({ initial: 0, final: 20 })
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [filters, setFilter] = useState({})

  const handleInput = ({ target: { name, value } }) => {
    setFilter(st => ({ ...st, [name]: value }))
  }

  const domainList = [...new Set(data.map(item => item.domain))]
  const genderList = [...new Set(data.map(item => item.gender))]

  useEffect(() => {
    let initialCount = 0;
    let finalCount = 20;
    initialCount = initialCount + (page - 1) * 20
    finalCount = finalCount * page
    setItems({ initial: initialCount, final: finalCount })
  }, [page])

  useEffect(() => {
    let result = data;
    const { domain, gender, available, searchText } = filters || ""
    setPage(1);
    if (searchText) {
      result = result.filter(item =>
        (item.first_name?.toLowerCase() + ' ' + item.last_name?.toLowerCase()).includes(searchText?.toLowerCase() || "")
      )
    }
    if (domain) {
      result = result.filter(item => item.domain === domain)
    }
    if (gender) {
      result = result.filter(item => item.gender == gender)
    }
    if (available) {
      result = result.filter(item => item.available)
    }
    setResultData(result)
  }, [filters])

  const AddToTeam = (data) => {
    if (team.find(item => item.id === data.id)) {
      console.log("true")
      setTeam(st => st.filter(item => item.id !== data.id))
    } else if (team.some(x => x.domain == data.domain)) {
      alert("Someone from this domain already is in this team")
    } else {
      setTeam(st => ([...st, data]))
    }
  }


  console.log(team)

  return (
    <div className="App">
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '100%',
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container columnGap={2} direction="row" xs='auto'>
          <Grid item>
            <TextField id="standard-basic" label="Search" variant="standard"
              inputProps={{
                name: 'searchText'
              }}
              onChange={handleInput}
              style={{ margin: '10px' }}
            />
          </Grid>
          <Grid item >
            <InputLabel>Domain</InputLabel>
            <Select
              inputProps={{
                name: 'domain'
              }}
              onChange={handleInput}
              value={filters?.domain}
              style={{ width: '150px' }}
            >
              <MenuItem value="">Select option</MenuItem>
              {(domainList || []).map(item => { return (<MenuItem value={item}>{item}</MenuItem>) })}
            </Select>

          </Grid>
          <Grid item >
            <InputLabel>Gender</InputLabel>
            <Select
              inputProps={{
                name: 'gender'
              }}
              onChange={handleInput}
              value={filters?.gender}
              style={{ width: '150px' }}
            >
              <MenuItem value="">Select option</MenuItem>
              {(genderList || []).map(item => { return (<MenuItem value={item}>{item}</MenuItem>) })}
            </Select>

          </Grid>
          <Grid item >
            <InputLabel>Availablilty</InputLabel>
            <Select
              inputProps={{
                name: 'available'
              }}
              onChange={handleInput}
              value={filters?.available}
              style={{ width: '150px' }}
            >
              <MenuItem value={false}>Select option</MenuItem>
              <MenuItem value={true}>Available</MenuItem>
            </Select>

          </Grid>
          <ButtonBase onClick={() => setOpen(true)}>
            <Typography>
              View Team
            </Typography>
          </ButtonBase>

        </Grid>
        <Pagination style={{ marginTop: '10px' }} count={parseInt(resultData?.length / 20)} page={page} onChange={(event, value) => setPage(value)} shape="rounded" variant='outlined' siblingCount={3}
          renderItem={(item) => (
            <PaginationItem
              {...item}
            />
          )}
        />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box style={style}>
            <Typography style={{ backgroundColor: 'white' }}>
              My team
            </Typography>
            <Grid container columnSpacing={2} direction="row" style={{ justifyContent: 'center', backgroundColor: 'white', overflow: 'scroll' }}>
              {(team || []).map(item => {
                return (
                  <Grid key={item.id} container spacing={0} style={{ margin: '10px', padding: '5px', maxWidth: '500px', border: '1px solid blue', borderRadius: '25px' }} >
                    <Grid item>
                      <ButtonBase sx={{ width: 128, height: 128 }}>
                        <Img alt="complex" src={item.avatar} />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography gutterBottom variant="subtitle1" component="div">
                            {item.first_name} {item.last_name}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {item.gender}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.email}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ cursor: 'pointer' }} variant="body2">
                            {item.domain}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" component="div">
                          {item.available ? "Available" : "Not Available"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </Modal>
        <Grid container columnSpacing={2} direction="row" style={{ justifyContent: 'center', }}>
          {(resultData.slice(items.initial, items.final) || []).map(item => {
            return (
              <Grid key={item.id} container spacing={0} style={{ margin: '10px', padding: '5px', maxWidth: '500px', border: '1px solid blue', borderRadius: '25px' }} >
                <Grid item>
                  <ButtonBase sx={{ width: 128, height: 128 }} onClick={() => { item.available && AddToTeam(item) }}>
                    <Img alt="complex" src={item.avatar} />
                  </ButtonBase>
                  {item.available && <Typography style={{ cursor: 'pointer', }}>
                    {!team.find(x => x.id === item.id) ? "Add to team" : "Remove from team"}
                  </Typography>}
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1" component="div">
                        {item.first_name} {item.last_name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {item.gender}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.email}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ cursor: 'pointer' }} variant="body2">
                        {item.domain}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" component="div">
                      {item.available ? "Available" : "Not Available"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
      <footer>

      </footer>
    </div>
  );
}

export default App;
