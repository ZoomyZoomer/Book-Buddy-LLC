import cookie from 'cookie';

export default function handler(req, res) {

    const { email, setCookie } = req.body;

    try {

        if (setCookie){

            res.setHeader(
                'Set-Cookie',
                cookie.serialize('email', email, {
                    httpOnly: true, // Helps prevent client-side access to the cookie
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict', // Prevents CSRF
                    path: '/', // Makes cookie accessible to the entire site
                })
            );

            return res.status(200).json({ message: 'Email stored successfully!' });

        } else {

            res.setHeader(
                'Set-Cookie',
                cookie.serialize('email', '', {
                    httpOnly: true, // Helps prevent client-side access to the cookie
                    secure: process.env.NODE_ENV === 'production',
                    expires: new Date(0), // Sets the expiration to a past date
                    sameSite: 'strict',
                    path: '/', // Ensures the cookie is cleared site-wide
                })
            );

            return res.status(200).json({ message: 'Cookie removed successfully!' });

        }

    } catch(e) {
        return res.status(500).json({message: 'Server error'});
    }

}