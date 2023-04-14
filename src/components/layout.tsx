import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main
      className="flex flex-col items-center min-h-screen overflow-hidden p-4"
    >
      {children}
    </main>
  )
}

export default Layout;

