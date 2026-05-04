import { useContext } from "react";
import { NavigationContext } from "./NavigationProvider";

export function useNavigation() {
    const navigation = useContext(NavigationContext);

    if (!navigation) {
        throw new Error("useNavigation must be used inside NavigationProvider.");
    }

    return navigation;
}
