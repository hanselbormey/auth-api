import { google } from 'googleapis';
import { API_URL } from '../config/constants';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${API_URL}/api/auth/google/oauth2callback`
);

export default oauth2Client;
