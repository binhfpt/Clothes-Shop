
export type ApiFetchOptions = RequestInit & {
    skipAuthRefresh?: boolean;
};

export const fetchBaseQueryWithAuth = async (input: RequestInfo, init: ApiFetchOptions = {}) => {

    const { skipAuthRefresh, ...restInit } = init;

    const fetchInit: RequestInit = {
        credentials: "include",
        ...restInit,
    };

    let res = await fetch(input, fetchInit);

    // Nếu 401 và chưa thử refresh
    if (res.status === 401 && !skipAuthRefresh) {
        const refreshRes = await fetch("/api/refresh", {
            method: "POST",
            credentials: "include"

        });

        if (!refreshRes.ok) {
            // refresh fail -> cho logout
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return { refreshStatus: "Failed" };
        }

        // Refresh thành công -> thử lại request ban đầu một lần
        res = await fetch(input, fetchInit);
    }

    return { data: await res.json() };
};

