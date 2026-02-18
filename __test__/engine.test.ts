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