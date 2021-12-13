import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import config from '../config';

export default function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();

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
                        Authorization: `Basic ${btoa(`${config.client_id}:${config.client_secret}`)}`
                    }
                }
            );

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
            }

            navigate('/');

            return;
        }

        if (!localStorage.getItem('token') && location.pathname !== '/login') {
            navigate('/login');
        }
    }, []);

}