import OpenAI from "openai";

const openai = new OpenAI({
    apiKey : process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export type StepType = 'clean' | 'summarize' | 'extract' | 'tag';

const stepPrompts: Record<StepType, string> = {
  clean: "You are a text cleaner. Remove unnecessary whitespace, fix obvious typos, and remove any weird symbols or formatting artifacts. Keep the core meaning exactly the same. Return only the cleaned text.",
  summarize: "You are a summarization assistant. Provide a concise, one-sentence summary of the provided text. Focus on the main action or point.",
  extract: "You are an information extractor. List the top 3 most important entities or key points from the text as a simple bulleted list.",
  tag: "You are a classification assistant. Categorize the text into exactly one of these categories: [Technical, Business, Creative, News, Other]. Return ONLY the single word for the category."
};

export async function runWorkflow(type : StepType, text : string) : Promise<string> {
    if(!process.env.GROQ_API_KEY){
        throw new Error("OpenAI key missing, check your env");
    }

    try{
        const res = await openai.chat.completions.create({
            model : "llama-3.1-8b-instant",
            messages : [
                {
                    role : "system",
                    content : stepPrompts[type]
                },
                {
                    role : "user",
                    content : text
                }
            ],
            temperature : 0.3,
            max_tokens : 500,
        });

        const result = res.choices[0].message.content?.trim();

        if(!result){
            throw new Error("AI returned nothing");
        }

        return result;
    }catch(error:any){
        console.error(error);
        throw error;
    }
}