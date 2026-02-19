jest.mock("@/lib/engine", () => ({
  runWorkflow: jest.fn().mockResolvedValue("mocked result"),
}));

jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    prisma: {
      workflow: {
        create: jest.fn().mockResolvedValue({}),
      },
    },
    default: {
      workflow: {
        create: jest.fn().mockResolvedValue({}),
      },
    },
  };
});

import { POST } from "@/app/api/run/route";

jest.mock("@/lib/engine");

const makeRequest = (body : any) => {
    return new Request("http://localhost/api/run", 
        {
            method : "POST", 
            headers: { "Content-Type": "application/json" },   
            body : JSON.stringify(body)
        });
}

describe("POST api/run", () => {
    it("resolves workflow correctly", async()=>{
        let res = await POST(makeRequest({text : "Hello", steps : ["clean", "tag"]}));
        let json = await res.json();
        expect(res.status).toBe(200);
        expect(json).toEqual([
            {step : "clean", result : "mocked result"},
            {step : "tag", result : "mocked result"}
        ]);
    })

    it("Error for empty input", async() => {
        let res = await POST(makeRequest({text : "", steps : []}));
        let json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            message : "Input text or steps missing"}
        );
    });

    it("Error for steps length greater than 4", async() => {
        let res = await POST(makeRequest({text : "Heloo", steps : ["a", "b", "c", "d", "e"]}));
        let json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({
            message : "Cannot input more than 4 steps"
        });
    });
});