//server side rendering component
export const metadata = { 
    title: 'HSC project',
    description: 'lol',
}

const RootLayout = ({children}) => {
    return (
      <html lang="en">
        <body>
            <main className="app">
                {children}
            </main>
        </body>
    </html>
    )
  }
  
  export default RootLayout