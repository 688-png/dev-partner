import { useState } from 'react';
import { Header } from '@/components/Header';
import { ModeToggle } from '@/components/ModeToggle';
import { StackSelector } from '@/components/StackSelector';
import { FolderTree } from '@/components/FolderTree';
import { RoadmapCard } from '@/components/RoadmapCard';
import { ChatInput } from '@/components/ChatInput';
import { stackTemplates, StackType, ModeType } from '@/data/stackTemplates';
import { Layers, Map, MessageSquare } from 'lucide-react';

const Index = () => {
  const [selectedStack, setSelectedStack] = useState<StackType>('mern');
  const [mode, setMode] = useState<ModeType>('beginner');
  const [activeTab, setActiveTab] = useState<'structure' | 'roadmap'>('structure');

  const currentTemplate = stackTemplates[selectedStack];
  const currentConfig = currentTemplate[mode];

  const handleChatSubmit = (message: string) => {
    // Parse message for stack keywords
    const stackKeywords: Record<string, StackType> = {
      'mern': 'mern',
      'mean': 'mean',
      'next': 'nextjs',
      'nextjs': 'nextjs',
      'supabase': 'react-supabase',
      'firebase': 'vue-firebase',
      'vue': 'vue-firebase',
    };

    const lowerMessage = message.toLowerCase();
    for (const [keyword, stack] of Object.entries(stackKeywords)) {
      if (lowerMessage.includes(keyword)) {
        setSelectedStack(stack);
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Scaffold</span> your next project
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate folder structures and roadmaps for any stack. 
            Choose your mode, select your tech, and start building.
          </p>
        </div>

        {/* Chat Input */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-mono">What do you want to build?</span>
          </div>
          <ChatInput onSubmit={handleChatSubmit} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <ModeToggle mode={mode} onModeChange={setMode} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">Stack:</span>
            <span className="text-foreground font-semibold">{currentTemplate.name}</span>
            <span>{currentTemplate.icon}</span>
          </div>
        </div>

        {/* Stack Selector */}
        <div className="mb-10">
          <StackSelector selectedStack={selectedStack} onStackChange={setSelectedStack} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === 'structure'
                ? 'bg-card text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="font-mono text-sm">Folder Structure</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-card text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="font-mono text-sm">Build Roadmap</span>
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {activeTab === 'structure' ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  {mode === 'beginner' ? 'Simple Structure' : 'Production-Ready Structure'}
                </h3>
                <FolderTree node={currentConfig.structure} />
              </div>
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="font-semibold mb-4">About this structure</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {mode === 'beginner'
                      ? "A simplified folder structure perfect for learning and small projects. Easy to understand and maintain."
                      : "A scalable architecture with separation of concerns, type safety, and production best practices."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>{mode === 'beginner' ? 'Easy to navigate' : 'Type-safe architecture'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>{mode === 'beginner' ? 'Minimal boilerplate' : 'Scalable patterns'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>{mode === 'beginner' ? 'Quick to set up' : 'CI/CD ready'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  {mode === 'beginner' ? 'Getting Started Roadmap' : 'Production Roadmap'}
                </h3>
                <RoadmapCard steps={currentConfig.roadmap} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-mono">DevScaffold — Build smarter, not harder</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
