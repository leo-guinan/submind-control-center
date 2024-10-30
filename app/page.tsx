import { SubMindList } from '@/components/submind-list';
import { CreateSubMind } from '@/components/create-submind';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">SubMind Control Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Create and manage your autonomous agents
          </p>
        </header>
        
        <CreateSubMind />
        <SubMindList />
      </div>
    </main>
  );
}