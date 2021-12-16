import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState } from 'react';

let offset = 0;

export default function SearchTracks() {
    // tracks is managed value
    // setTracks fucntion to be called to set a new track
    const [tracks, setTracks] = useState([]);
    const [searchQuery, setSearchQuery] = useState();


    const refreshToken =  async () => {
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const refresh_token = localStorage.getItem('refresh_token');

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        });
        
        const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                body,
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
                }
            }
        );
        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return true;
        }
        return false
    }



    const handleSearchClick = async (event) => {
        if (!searchQuery){
            return
        }
        if(event){
            // temporary patch
            setTracks([]);
            offset = 0;
        }
        const token = localStorage.getItem('token');
        const response = fetch(
                `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=20&access_token=${token}&offset=${offset}`,
                {
                    method: 'GET',
                }
            );
        const data = await (await response).json();

        if (data?.error?.status === 401){
            console.log("TOKEN EXPIRED");
            refreshToken();
        }
        setTracks([...tracks, ...data.tracks.items]);
    }

    const handleBottomScroll = (event) => {
        //scrollHeight indicates the height of an element (including non visible elements)
        //scrollTop (var) indicates number of pixels that an element is scrolled vertically
        //clientHeith indicates element inner height (defined by maxHeight below)
        if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) {
            offset += 20;
            handleSearchClick();
            //user is at the end of the list so load more items
        } 
    }

    return (
        <Grid container mt={0} mb={4} flexDirection="column">
            <Grid item container mb={2} mt={2}>
                <TextField mt={2} onChange={event => setSearchQuery(event.target.value)} required={true}/>
                <Button variant="contained" sx={{marginLeft: 2}} onClick={handleSearchClick}>Search</Button>
            </Grid>
            <Grid item container spacing={4} style={{maxHeight:700,overflowY:'scroll'}} onScroll={handleBottomScroll} >
                {tracks.map((track) => (
                    <Grid item key={track.id}>
                        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                sx={{
                                    height: 200,
                                    width: 200
                                }}
                                image={track.album.images[0].url}
                                alt={track.album.name}>
                            </CardMedia>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}
