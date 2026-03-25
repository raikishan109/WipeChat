import StyledJsxRegistry from '../lib/registry'
import './globals.css'

export const metadata = {
    title: 'WipeChat - Temporary Anonymous Chat',
    description: 'WipeChat: Secure, anonymous, temporary chat platform with 24-hour auto-delete',
    manifest: '/manifest.json',
    icons: {
        icon: [
            {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238B5CF6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='25' fill='url(%23grad)'/%3E%3Cpath d='M25 35C25 31.6863 27.6863 29 31 29H69C72.3137 29 75 31.6863 75 35V55C75 58.3137 72.3137 61 69 61H56L42 71V61H31C27.6863 61 25 58.3137 25 55V35Z' fill='white'/%3E%3Cpath d='M58 33L55.5 40L49 42L55.5 44L58 51L60.5 44L67 42L60.5 40L58 33Z' fill='%238B5CF6'/%3E%3C/svg%3E",
                type: "image/svg+xml",
            }
        ],
        apple: [
            { url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238B5CF6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%233B82F6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='25' fill='url(%23grad)'/%3E%3Cpath d='M25 35C25 31.6863 27.6863 29 31 29H69C72.3137 29 75 31.6863 75 35V55C75 58.3137 72.3137 61 69 61H56L42 71V61H31C27.6863 61 25 58.3137 25 55V35Z' fill='white'/%3E%3Cpath d='M58 33L55.5 40L49 42L55.5 44L58 51L60.5 44L67 42L60.5 40L58 33Z' fill='%238B5CF6'/%3E%3C/svg%3E" }
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
