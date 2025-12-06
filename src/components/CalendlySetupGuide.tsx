import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  Check,
  Settings,
  Webhook,
  FileText,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const CalendlySetupGuide = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendly-webhook`;

  const examplePayload = {
    event: "invitee.created",
    payload: {
      event: {
        uuid: "event-uuid-123",
        start_time: "2025-01-15T10:00:00Z",
        end_time: "2025-01-15T10:30:00Z"
      },
      invitee: {
        email: "developer@example.com",
        name: "John Developer"
      },
      questions_and_answers: [
        { question: "What project are you reviewing?", answer: "E-commerce Platform" },
        { question: "What % is complete?", answer: "65%" },
        { question: "What slowed you down?", answer: "Third-party API integration issues" },
        { question: "What needs review?", answer: "Payment gateway implementation" },
        { question: "What changed since last session?", answer: "Added new shipping provider" }
      ]
    }
  };

  const emailTemplate = `Subject: Project Review Summary - {{project_name}}

Hi {{invitee_name}},

Here's your project review summary from our session on {{event_date}}:

📊 Project Health: {{health_status}}
📈 Progress: {{progress}}%
⚠️ Risk Level: {{risk_level}}
📅 Timeline: {{timeline_alignment}}

🎯 Suggested Focus:
{{suggested_focus}}

📋 Action Plan:
{{action_plan}}

🏁 Next Milestone:
{{next_milestone}}

Book your next review session: https://calendly.com/sirmakau

Best regards,
DevScaffold`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Calendly Integration Setup</h3>
          <p className="text-sm text-muted-foreground">Configure your Project Review Session event</p>
        </div>
      </div>

      {/* Step 1: Create Event Type */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">1</span>
            <span className="font-medium text-foreground">Create Event Type</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Create a new event type called "Project Review Session" in Calendly with these custom questions:
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 font-mono text-sm">
            <p>• What project are you reviewing?</p>
            <p>• What % is complete?</p>
            <p>• What slowed you down?</p>
            <p>• What needs review?</p>
            <p>• What changed since last session?</p>
          </div>
          <a 
            href="https://calendly.com/event_types/new" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Calendly
            </Button>
          </a>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 2: Webhook Setup */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">2</span>
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Configure Webhook</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Add this webhook URL to Calendly (Integrations → Webhooks):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/50 rounded-lg px-4 py-2 text-sm font-mono text-foreground overflow-x-auto">
              {webhookUrl}
            </code>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}
            >
              {copied === 'Webhook URL' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Subscribe to: <code className="bg-muted px-1 rounded">invitee.created</code> event
          </p>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 3: Example Payload */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">3</span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Example Payload</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <div className="relative">
            <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto max-h-64">
              {JSON.stringify(examplePayload, null, 2)}
            </pre>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(JSON.stringify(examplePayload, null, 2), 'Payload')}
            >
              {copied === 'Payload' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Step 4: Email Template */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">4</span>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Summary Email Template</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Use this template for automated summary emails (via Zapier/Make):
          </p>
          <div className="relative">
            <pre className="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto max-h-64 whitespace-pre-wrap">
              {emailTemplate}
            </pre>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(emailTemplate, 'Email template')}
            >
              {copied === 'Email template' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 pt-2">
        <a href="https://calendly.com/sirmakau" target="_blank" rel="noopener noreferrer">
          <Button variant="default" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Book a Session
          </Button>
        </a>
        <a href="https://calendly.com/integrations/webhooks" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <Webhook className="w-4 h-4" />
            Webhooks Dashboard
          </Button>
        </a>
      </div>
    </div>
  );
};
