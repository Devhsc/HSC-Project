import '@styles/globals.css'
import Home from '@app/page'

export const metadata = { 
    title: 'HSC project',
    description: 'lol',
}

const RootLayout = () => {
    return (
      <html Lang="en">
        <body>
            <div className="main">
                <div className="gradient" />
            </div>
            <main className="root">
                <Home />
            </main>
        </body>
    </html>
    )
  }
  
  export default RootLayout