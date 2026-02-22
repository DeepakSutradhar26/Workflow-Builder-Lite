import {z} from "zod";

export const StepEnum = z.enum([
    "clean",
    "summarize",
    "extract",
    "tag",
]);

export const RunWorkflowSchema = z.object({
    text : z.string()
    .min(1, "Input text cannot be empty")
    .max(5000, "Input cannot be more than 5000 characters"),

    steps : z.array(StepEnum)
    .min(1, "Atleast 1 step is required")
    .max(4, "Input steps cannot be more than 4")
});