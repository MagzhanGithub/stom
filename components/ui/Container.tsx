import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  narrow?: boolean
  wide?: boolean
}

export default function Container({
  children,
  className,
  as: Tag = 'div',
  narrow = false,
  wide = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow && 'max-w-narrow',
        wide   && 'max-w-[1440px]',
        !narrow && !wide && 'max-w-container',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
