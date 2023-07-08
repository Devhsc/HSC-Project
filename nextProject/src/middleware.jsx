const { NextRequest, NextResponse } = require('next/server');
const { v4: uuidv4 } = require('uuid');
const { parse, serialize } = require('cookie');

const createUniqueUserToken = () => {
  // Generate a unique user token using UUID version 4
  return uuidv4();
};

const setUniqueUserTokenCookie = (res, token) => {
  // Set the user token as a cookie
  const cookieOptions = {
    httpOnly: true, // Cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Restrict cookie to secure (HTTPS) connections in production
    sameSite: 'strict', // Protect against cross-site request forgery (CSRF) attacks
    maxAge: 60 * 60 * 24 * 7, // Set the cookie expiration to 7 days (adjust as needed)
    path: '/', // Set the cookie to be accessible across the entire site
  };

  res.headers.set('Set-Cookie', serialize('userToken', token, cookieOptions));
  return res;
};

export function middleware(req) {
  //console.log('request', req.nextUrl.pathname)

  // Only want to run this middleware if an API route is called (e.g., upload)
  if (req.nextUrl.pathname.startsWith('/api/upload')) {
    console.log('API route called');
    return NextResponse.next();
  }

  // Check if the user token cookie already exists
  let userToken = req.cookies.get('userToken');
  //console.log('userToken', userToken)
  
  if (!userToken) {
    // If the user token cookie doesn't exist, create a new unique user token
    userToken = createUniqueUserToken();

    // Store the user token in the cookie
    const response = NextResponse.next();

    let res = setUniqueUserTokenCookie(response, userToken);
    return res;
  }


  // Attach the user token to the request for further use
  //req.userToken = userToken;

  // Call the Next.js handler
}

