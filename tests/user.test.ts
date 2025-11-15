import request from "supertest";

const API = "http://localhost:3000";

describe("User API", () => {
    let token: string;

    test("Login thành công", async () => {
        const loginRes = await request(API)
            .post("/api/login")
            .send({ email: "admin@gmail.com", password: "123456" });

        expect(loginRes.status).toBe(200);

        const setCookieHeader = loginRes.headers['set-cookie'];
        const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

        const tokenCookie = cookies.find((c) => c.startsWith("token="));
        if (!tokenCookie) throw new Error("Token cookie not found");

        const token = tokenCookie.split(';')[0].split('=')[1];

    });

    // test("Lấy thông tin user", async () => {
    //     const userRes = await request(API)
    //         .get("/api/user")
    //         .set("Cookie", [`token=${token}`]);

    //     expect(userRes.status).toBe(200);
    //     expect(userRes.body.id).toBeDefined();
    // });
});
