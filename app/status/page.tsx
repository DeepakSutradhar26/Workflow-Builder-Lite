import {prisma} from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

function StatusCard({ title, status, detail }: { title: string; status: string; detail: string }) {
  const isOk = status === 'Connected' || status === 'Running' || status === 'API Key Valid';
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm flex items-center justify-between">
      <div>
        <h2 className="font-bold text-black">{title}</h2>
        <p className="text-sm text-gray-500">{detail}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        isOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {status}
      </span>
    </div>
  );
}

export default async function StatusPage(){
    let dbStatus = "Checking...";
    try{
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = "Connected";
    }catch(error:any){
        dbStatus = "Connection Failed";
    }

    let llmStatus = "Checking...";
    try{
        const openai = new OpenAI({
          apiKey : process.env.GROQ_API_KEY,
          baseURL: "https://api.groq.com/openai/v1",
        });
        await openai.models.list();
        llmStatus = "API Key Valid";
    }catch(error:any){
        llmStatus = "Authentication Failed";
    }

    return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">System Health</h1>
      
      <div className="grid gap-4">
        <StatusCard title="Backend Server" status="Running" detail="Next.js App Router" />
        <StatusCard 
          title="Database (Prisma)" 
          status={dbStatus} 
          detail={dbStatus === 'Connected' ? "Postgres/SQLite is reachable" : "Check DATABASE_URL in .env"} 
        />
        <StatusCard 
          title="LLM (OpenAI)" 
          status={llmStatus} 
          detail={llmStatus === 'API Key Valid' ? "Groq-ai is ready" : "Check GROQ_API_KEY in .env"} 
        />
      </div>
      
      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:underline">Return to Builder</a>
      </div>
    </main>
  );
}