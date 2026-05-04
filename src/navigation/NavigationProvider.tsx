import { createContext, useMemo, useState, type PropsWithChildren } from "react";
import { defaultRoute, type AppRoute } from "./routes";

type NavigationContextValue = {
    route: AppRoute;
    canGoBack: boolean;
    navigate: (route: AppRoute) => void;
    goBack: () => void;
    reset: (route?: AppRoute) => void;
};

export const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: PropsWithChildren) {
    const [stack, setStack] = useState<AppRoute[]>([defaultRoute]);
    const route = stack[stack.length - 1] ?? defaultRoute;

    const value = useMemo<NavigationContextValue>(
        () => ({
            route,
            canGoBack: stack.length > 1,
            navigate: (nextRoute) => {
                setStack((currentStack) => [...currentStack, nextRoute]);
            },
            goBack: () => {
                setStack((currentStack) =>
                    currentStack.length > 1 ? currentStack.slice(0, currentStack.length - 1) : currentStack,
                );
            },
            reset: (nextRoute = defaultRoute) => {
                setStack([nextRoute]);
            },
        }),
        [route, stack.length],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
