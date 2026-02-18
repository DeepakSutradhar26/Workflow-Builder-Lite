//Mock implementation of prisma.ts

jest.mock("@prisma/client", () => {
    return {
        PrismaCLient : jest.fn().mockImplementation(()=>({
            $connect : jest.fn(),
            $disconnect : jest.fn()
        }))
    }
});

jest.mock("@prisma/adapter-pg", () => {
    return {
        PrismaPg : jest.fn().mockImplementation(() => ({}))
    }
});

describe("Prisma Connection", () => {
    it("Should create prisma connection", async()=>{
        const {prisma} = await import("@/lib/prisma");
        expect(prisma).toBeDefined();
    })

    it("Singleton in developement", async() => {
        const {prisma : prisma1} = await import("@/lib/prisma");
        const {prisma : prisma2} = await import("@/lib/prisma");
        expect(prisma1).toBe(prisma2);
    });
});