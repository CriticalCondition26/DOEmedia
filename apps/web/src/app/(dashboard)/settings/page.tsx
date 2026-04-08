"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage Meta ad account connections, team members, and system configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Meta Account Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Ad Account Connections</CardTitle>
            <CardDescription>
              Connect Meta ad accounts via OAuth to start pulling performance data.
              Each client needs their ad account connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 rounded-md border border-border p-4">
              <p className="text-sm text-muted-foreground">
                No Meta ad accounts connected yet. Click below to start the OAuth
                flow and connect your first account.
              </p>
            </div>
            <Button>Connect Meta Account</Button>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              API keys for AI models and external services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Anthropic (Claude)</p>
                  <p className="text-xs text-muted-foreground">
                    Used for ad copy, strategy, and analysis
                  </p>
                </div>
                <Badge variant={process.env.ANTHROPIC_API_KEY ? "success" : "destructive"}>
                  {process.env.ANTHROPIC_API_KEY ? "Connected" : "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Google AI (Gemini)</p>
                  <p className="text-xs text-muted-foreground">
                    Used for video analysis and visual concepts
                  </p>
                </div>
                <Badge variant={process.env.GOOGLE_AI_API_KEY ? "success" : "destructive"}>
                  {process.env.GOOGLE_AI_API_KEY ? "Connected" : "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Meta Marketing API</p>
                  <p className="text-xs text-muted-foreground">
                    Used for ad performance data ingestion
                  </p>
                </div>
                <Badge variant={process.env.META_APP_ID ? "success" : "destructive"}>
                  {process.env.META_APP_ID ? "Connected" : "Not Configured"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>
              Manage pod members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Team management will be available after authentication is configured.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
