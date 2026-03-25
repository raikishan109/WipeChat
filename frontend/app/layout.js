import StyledJsxRegistry from '../lib/registry'
import './globals.css'

export const metadata = {
    title: 'WipeChat - Temporary Anonymous Chat',
    description: 'WipeChat: Secure, anonymous, temporary chat platform with 24-hour auto-delete',
    manifest: '/manifest.json',
    icons: {
        icon: [
            {
                url: '/icons/icon-512x512.svg',
                type: 'image/svg+xml',
            }
        ],
        apple: [
            {
                url: '/icons/icon-512x512.svg',
                type: 'image/svg+xml',
            }
        ],
    },
}

export const viewport = {
    themeColor: '#6366f1',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <StyledJsxRegistry>{children}</StyledJsxRegistry>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                          navigator.serviceWorker.register('/sw.js');
                        });
                      }
                    `,
                  }}
                />
            </body>
        </html>
    )
}
