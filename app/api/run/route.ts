import { NextResponse } from "next/server";
import { runWorkflow, StepType } from "@/lib/engine";
import { prisma } from "@/lib/prisma";

export async function POST(req : Request) {
    try{
        const {text, steps} = await req.json();
    
        if(!text || !steps || steps.length == 0){
            return NextResponse.json(
                {message : "Input text or steps missing"},
                {status : 400},
            );
        }

        let currentInput = text;
        const results = []

        for(const step of steps){
            const output = await runWorkflow(step as StepType, text);
            results.push({step, result : output});
            currentInput = output;
        }

        await prisma.workflow.create({
            data : {
                inputText : currentInput,
                results : results,
            }
        });

        return NextResponse.json(results);
    }catch(error:any){
        console.error(error);
        return NextResponse.json({
            message : "Internal server error, unable to post", 
            details : error.message,
            status : 500,
        });
    }
}