import Button from '@mui/material/Button';

export default function AuthenticationButton() {
    const spotifyApi = 'https://accounts.spotify.com';
    const client_id = process.env.CLIENT_ID;

    const authenticateUser = async () => {
        const authOptions = {
            client_id: client_id,
            response_type: 'code',
            redirect_uri: 'http://localhost:1234/callback'
        };

        window.location.href = `${spotifyApi}/authorize?${new URLSearchParams(authOptions)}`, { mode: 'no-cors', redirect: 'follow' };
    };

    return (
        <Button variant="contained" onClick={authenticateUser}>
            Login with Spotify
        </Button>
    );
}
