import Favourites from "./favouriteControl.js";
import User from "./userdata.js";
import API from "./api.js";

export default async function postSearch(tags = [], page = 0, take = 10, count = false, ignoreFilters = false) {
    const params = new URLSearchParams();

    if (tags.some(v => v.startsWith("fav:local"))) {
        const localFavIndex = tags.indexOf("fav:local");
        tags.splice(localFavIndex, 1);

        if (Favourites.localFavs?.length) {
            tags.push("id:" + Favourites.localFavs.join(","));
        }
    }
    
    if (!ignoreFilters) {
        const contentFilter = User.Settings.get("contentFiler");
        for (const rating in contentFilter) {
            if (!contentFilter[rating].show) {
                tags.push(`-rating:${rating}`);
            }
        }
    }

    if (tags.length > 0) {
        params.set("tags", tags.join("+"));
    }

    if (count) {
        params.set("count", "true");
    } else {
        if (page) params.set("p", page);
        if (take) params.set("t", take);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const postsResp = await API("GET", `/api/posts${query}`);
    return postsResp;
}
