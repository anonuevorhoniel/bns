"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent theme-related rendering during SSR
    if (!mounted) {
        return <>{children}</>;
    }
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
