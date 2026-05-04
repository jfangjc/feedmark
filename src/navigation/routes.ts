export type FeedRouteParams = {
    feedId?: string;
    title?: string;
};

export type AppTabRouteName = "home" | "all" | "add" | "manage" | "setting";

export type AppTabRoute = {
    name: AppTabRouteName;
};

export type AppRoute =
    | AppTabRoute
    | {
          name: "feed";
          params: FeedRouteParams;
      };

export const homeRoute: AppTabRoute = {
    name: "home",
};

export const appTabs: Array<{
    name: AppTabRouteName;
    label: string;
}> = [
    {
        name: "home",
        label: "Home",
    },
    {
        name: "all",
        label: "All",
    },
    {
        name: "add",
        label: "Add",
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

export function createFeedRoute(params: FeedRouteParams = {}): AppRoute {
    return {
        name: "feed",
        params,
    };
}

export function getActiveTabName(route: AppRoute): AppTabRouteName {
    if (route.name === "feed") {
        return "home";
    }

    return route.name;
}
