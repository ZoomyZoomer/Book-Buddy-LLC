import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Parse cookies from the request headers
        const cookies = cookie.parse(req.headers.cookie || '');
        const email = cookies.email;

        if (email) {
            res.status(200).json({ email });
        } else {
            res.status(404).json({ message: 'Email cookie not found.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
}