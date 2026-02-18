import { POST } from "@/app/api/run/route";
import { runWorkflow } from "@/lib/engine";

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
    beforeEach(() => jest.clearAllMocks());

    it("All errors and resolve", ()=>{
        (runWorkflow as jest.Mock).mockResolvedValue("mocked result");
    });

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
        expect(json).toEqual("Input text or steps missing");
    });

    it("Error for steps length greater than 4", async() => {
        let res = await POST(makeRequest({text : "Heloo", steps : ["a", "b", "c", "d", "e"]}));
        let json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual("Cannot input more than 4 steps");
    });
});