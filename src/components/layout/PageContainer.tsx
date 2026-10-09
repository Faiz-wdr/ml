import React from 'react'

export interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <main
      className={`flex-1 w-full max-w-6xl mx-auto px-3.5 py-4 sm:px-6 sm:py-8 lg:px-8 flex flex-col justify-start sm:justify-center min-h-0 ${className}`}
    >
      {children}
    </main>
  )
}
