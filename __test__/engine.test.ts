import { runWorkflow, StepType } from "@/lib/engine";

jest.mock("openai", () => {
    return {
        chat : {
            completions : {
                create : jest.fn(({messages} : any) => {
                    const promptType = messages[0].content as string;
                    const userInput  = messages[1].content as string;

                    if(promptType.includes("clean")){
                        return Promise.resolve(
                            {
                                choices : [
                                    {message : 
                                        {content : userInput.replace(/\s+/g, " ").trim()}
                                    }
                                ]
                            }
                        )
                    }

                    if(promptType.includes("summarize")){
                        return Promise.resolve(
                            {
                                choices : [
                                    {message : 
                                        {content : "Summary Sentence ... "}
                                    }
                                ]
                            }
                        )
                    }

                    if(promptType.includes("extract")){
                        return Promise.resolve(
                            {
                                choices : [
                                    {message : 
                                        {content : "Extract1, Extract2, Extract3"}
                                    }
                                ]
                            }
                        )
                    }

                    if(promptType.includes("tag")){
                        return Promise.resolve(
                            {
                                choices : [
                                    {message : 
                                        {content : "Tag1, Tag2, Tag3"}
                                    }
                                ]
                            }
                        )
                    }

                    return Promise.resolve(
                            {
                                choices : [
                                    {message : 
                                        {content : "Unknown Step Encountered"}
                                    }
                                ]
                            }
                        )
                }),
            }
        }
    }
});

describe("runWorkFlow", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = {...OLD_ENV, GROQ_API_KEY : "dummy_key"};
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });

    it("Throw error if api key is missing", async() => {
        process.env.GROQ_API_KEY = "";
        await expect(runWorkflow("clean", "test")).rejects.toThrow("API key is missing");
    });

    it.each([
        ["clean", "Hello    world!", "Hello world!"],
        ["summarize", "Some long text", "Summary sentence."],
        ["extract", "Important info", "- Entity1\n- Entity2\n- Entity3"],
        ["tag", "Technical content", "Technical"]
    ])("process workflow", async(type, input, output) => {
        const result = await runWorkflow(type as any, input);
        expect(result).toBe(output);
    });
});