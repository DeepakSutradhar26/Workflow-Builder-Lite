import { NextResponse } from "next/server";
import { runWorkflow, StepType } from "@/lib/engine";
import { prisma } from "@/lib/prisma";
import {logger} from "@/lib/logger";

export async function POST(req : Request) {
    const startTime = performance.now();
    try{
        const {text, steps} = await req.json();

        if(!text || !steps || steps.length == 0){
            logger.warn({text, steps},"Input text or steps cannot be empty");
            return NextResponse.json(
                {message : "Input text or steps missing"},
                {status : 400},
            );
        }

        if(steps.length > 4){
            logger.warn({stepsLength : steps.length},"Input steps cannot be more than 4");
            return NextResponse.json(
                {message : "Cannot input more than 4 steps"},
                {status : 400},
            );
        }

        let currentInput = text;
        const results = []

        for(const step of steps){
            const startTms = performance.now();
            const output = await runWorkflow(step as StepType, text);
            const endTms = performance.now();

            const stepTms = (endTms - startTms).toFixed(2);
            results.push({step, result : output});
            currentInput = output;

            logger.info({step, stepTms, currentInput},"Step executed");
        }

        await prisma.workflow.create({
            data : {
                inputText : currentInput,
                results : results,
            }
        });

        const endTime = performance.now();
        const responseTime = (endTime - startTime).toFixed(2);

        logger.info({responseTime, results},"Workflow executed");

        return NextResponse.json(results);
    }catch(error:any){
        const endTime = performance.now();
        const responseTime = (endTime - startTime).toFixed(2);

        logger.error(error,"Internal server error in POST api/run",{responseTime});

        return NextResponse.json({
            message : "Internal server error, unable to post", 
            details : error.message,
            status : 500,
        });
    }
}