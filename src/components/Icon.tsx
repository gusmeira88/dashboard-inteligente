type Props = {
    name: string
    size?: number
}

function Icon({ name, size = 18 }: Props) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    }
    switch (name) {
        case 'dashboard':
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
            )
        case 'overview':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v9l6 3" />
                </svg>
            )
        case 'package':
            return (
                <svg {...common}>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                </svg>
            )
        case 'plus':
            return (
                <svg {...common}>
                    <path d="M12 5v14M5 12h14" />
                </svg>
            )
        case 'edit':
            return (
                <svg {...common}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            )
        case 'trash':
            return (
                <svg {...common}>
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
            )
        case 'search':
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            )
        case 'wallet':
            return (
                <svg {...common}>
                    <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
                    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                    <circle cx="17" cy="14" r="1.5" />
                </svg>
            )
        case 'tag':
            return (
                <svg {...common}>
                    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <circle cx="7.5" cy="7.5" r="1.2" />
                </svg>
            )
        case 'trending':
            return (
                <svg {...common}>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
            )
        case 'gauge':
            return (
                <svg {...common}>
                    <path d="M12 14l4-4" />
                    <path d="M3.34 17A10 10 0 1 1 21 12a10 10 0 0 1-1.34 5" />
                </svg>
            )
        case 'sun':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            )
        case 'moon':
            return (
                <svg {...common}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )
        default:
            return null
    }
}

export default Icon
