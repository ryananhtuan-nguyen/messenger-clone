import { Metadata } from 'next'
export function constructMetadata({
  title = 'MessengerClone - a simple realtime messaging app',
  description = 'MessengerClone is a chat app inspired by Facebook messenger, created just for learning purposes',
  image = '/thumbnail.jpg',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL('https://messenger-clone-eight-navy.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
