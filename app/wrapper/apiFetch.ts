export type ApiFetchOptions = RequestInit & {
    skipAuthRefresh?: boolean; // cho mấy API đặc biệt, vd /auth/refresh
};

export async function apiFetch(input: RequestInfo, init: ApiFetchOptions = {}) {
    const { skipAuthRefresh, ...restInit } = init;

    // Luôn gửi cookie (token, rftoken) trừ khi tự override
    const fetchInit: RequestInit = {
        credentials: "include",
        ...restInit,
    };

    let res = await fetch(input, fetchInit);

    // Nếu 401 và được phép auto refresh
    if (res.status === 401 && !skipAuthRefresh) {
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (!refreshRes.ok) {
            // Refresh fail -> coi như hết phiên -> cho logout
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return res; // trả response 401 cũ
        }

        // Refresh ok -> thử lại request cũ một lần
        res = await fetch(input, fetchInit);
    }

    return res;
}
