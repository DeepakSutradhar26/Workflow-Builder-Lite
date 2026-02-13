"use client"

import { useState } from "react";
import Link from "next/link";

type Step = "clean" | "summarize" | "extract" | "tag"

export default function Home(){
  const [inputText, setInputText] = useState("");
  const [inputSteps, setInputSteps] = useState<Step[]>([]);
  const [results, setResults] = useState<{step : string, result : string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addStep = (step : Step) => {
    if(inputSteps.length >= 4) return alert("At max four steps is possible");
    setInputSteps([...inputSteps, step])
  };

  const removeStep = () => {
    setInputSteps(inputSteps.slice(0, -1));
  };

  const handleWorkflow = async () => {
    if(inputText.length == 0) return alert("Add input text");
    if(inputSteps.length == 0) return alert("Add input steps");

    setIsLoading(true);

    try{
      const res = await fetch("/api/run", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({input : inputText, steps : inputSteps}),
      })

      if(!res.ok) throw new Error("Workflow execution failed");

      const data = await res.json();
      setResults(data);

    }catch(error:any){
      console.error(error);
      alert("Internal server error 500");

    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflow Builder Lite</h1>
            <p className="text-gray-500">Chain AI steps to process your text.</p>
          </div>
          <div className="space-x-4">
            <Link href="/status" className="text-sm font-medium text-blue-600 hover:underline">Status</Link>
            <Link href="/history" className="text-sm font-medium text-blue-600 hover:underline">History</Link>
          </div>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <label className="block text-sm font-semibold mb-2">Input Text</label>
          <textarea
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Paste your content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h2 className="text-sm font-semibold mb-4 text-gray-700 uppercase tracking-wider">Builder</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {(["clean", "summarize", "extract", "tag"] as Step[]).map((step) => (
              <button
                key={step}
                onClick={() => addStep(step)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              >
                + {step.charAt(0).toUpperCase() + step.slice(1)}
              </button>
            ))}
            <button 
              onClick={removeStep}
              className="px-4 py-2 text-red-500 text-sm hover:bg-red-50 rounded-full"
            >
              Undo Step
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-2">
            {inputSteps.length === 0 && <p className="text-gray-400 italic text-sm">No steps added yet...</p>}
            {inputSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold">
                  {step.toUpperCase()}
                </div>
                {index < inputSteps.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={handleWorkflow}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            isLoading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {isLoading ? "Running AI Workflow..." : "Run Workflow"}
        </button>

        {results.length > 0 && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl font-bold">Output</h2>
            {results.map((res, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-blue-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <span className="text-xs font-black text-blue-600 uppercase mb-1 block">
                    Step {i + 1}: {res.step}
                  </span>
                  <p className="text-gray-800 whitespace-pre-wrap">{res.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}