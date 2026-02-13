import {prisma} from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HistoryPage(){
    const data = await prisma.workflow.findMany({
        take : 5,
        orderBy : {createdAt : "desc"},
    });

    return (
    <main className="p-8 max-w-4xl mx-auto text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Execution History</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">New Workflow</Link>
      </div>

      <div className="space-y-6">
        {data.length === 0 && (
          <p className="text-gray-500 italic">No activity recorded.</p>
        )}

        {data.map((run) => (
          <div key={run.id} className="border rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              <span>ID: {run.id}</span>
              <span>{new Date(run.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="p-6">
              <section className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Source Text</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic line-clamp-2">
                  {run.inputText}
                </p>
              </section>

              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Workflow Steps</h3>
              <div className="space-y-4">
                {JSON.parse(run.results as string).map((res: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded bg-gray-900 text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      {idx !== JSON.parse(run.results as string).length - 1 && (
                        <div className="w-px h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-xs font-black text-blue-600 uppercase">{res.step}</p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">{res.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}