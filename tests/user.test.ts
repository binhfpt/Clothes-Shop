// tests/getSku.test.ts
const getSku = (name: string, color: string): string => {
    const skuRaw = name + " " + color

    return skuRaw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")     // thay khoảng trắng bằng dấu -
        .replace(/[^\w\-]+/g, ""); // loại bỏ ký tự đặc biệt
};
describe("getSku", () => {
    test("tao sku tu name + color, format dung", () => {
        const sku = getSku("ao Thun   Oversize", "mau do!!")

        expect(sku).toBe("ao-thun-oversize-mau-do")
    })

    test("trim khoang trang hai ben", () => {
        const sku = getSku("   Hoodie Basic  ", "   Black   ")
        expect(sku).toBe("hoodie-basic-black")
    })

    test("xu ly chuoi rong", () => {
        const sku = getSku("", "")
        expect(sku).toBe("")
    })
})
