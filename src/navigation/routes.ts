export type AppTabRouteName = "feed" | "all" | "manage" | "setting";

export type AppTabRoute = {
    name: AppTabRouteName;
};

export type AppRoute = AppTabRoute;

export const defaultRoute: AppTabRoute = {
    name: "feed",
};

export const appTabs: Array<{
    name: AppTabRouteName;
    label: string;
}> = [
    {
        name: "feed",
        label: "Feed",
    },
    {
        name: "all",
        label: "All",
    },
    {
        name: "manage",
        label: "Manage",
    },
    {
        name: "setting",
        label: "Setting",
    },
];

export function createTabRoute(name: AppTabRouteName): AppTabRoute {
    return {
        name,
    };
}

export function getActiveTabName(route: AppRoute): AppTabRouteName {
    return route.name;
}
