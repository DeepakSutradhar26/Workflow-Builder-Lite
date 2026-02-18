import { runWorkflow, StepType } from "@/lib/engine";

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(({ messages }: any) => {
          const promptType = messages[0].content.toLowerCase();
          const userInput = messages[1].content;

          if (promptType.includes("text cleaner")) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: userInput.replace(/\s+/g, " ").trim(),
                  },
                },
              ],
            });
          }

          if (promptType.includes("summarization assistant")) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: "Summary sentence.",
                  },
                },
              ],
            });
          }

          if (promptType.includes("information extractor")) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: "- Entity1\n- Entity2\n- Entity3",
                  },
                },
              ],
            });
          }

          if (promptType.includes("classification assistant")) {
            return Promise.resolve({
              choices: [
                {
                  message: {
                    content: "Technical",
                  },
                },
              ],
            });
          }

          return Promise.resolve({
            choices: [
              {
                message: {
                  content: "Unknown Step Encountered",
                },
              },
            ],
          });
        }),
      },
    },
  })),
}));

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
        await expect(runWorkflow("clean", "test")).rejects.toThrow("OpenAI key missing, check your env");
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