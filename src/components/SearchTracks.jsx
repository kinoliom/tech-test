import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function SearchTracks() {
    const [tracks, setTracks] = useState([]);

    return (
        <Grid container mt={0} mb={4} flexDirection="column">
            <Grid item container mb={2} mt={2}>
                <TextField mt={2}/>
                <Button variant="contained" sx={{marginLeft: 2}}>Search</Button>
            </Grid>
            <Grid item container spacing={4}>
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
