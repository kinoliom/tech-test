import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
export default function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    useEffect(async () => {
        if (location.pathname === '/callback') {
            const code = location.search.match(/code=(.*)/)[1];
            const body = new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:1234/callback'
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
            }else{
                console.error('error in token set up');
            }

            navigate('/');

            return;
        }

        if (!localStorage.getItem('token') && location.pathname !== '/login') {
            navigate('/login');
        }
    }, []);

}