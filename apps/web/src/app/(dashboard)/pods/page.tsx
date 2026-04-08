"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PodMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Pod {
  id: string;
  name: string;
  members: {
    mediaBuyer: PodMember | null;
    strategist: PodMember | null;
    designer: PodMember | null;
    accountManager: PodMember | null;
    adLoader: PodMember | null;
  };
  clients: Array<{ id: string; name: string; industry: string }>;
  clientCount: number;
}

// Mock pods for initial UI
const mockPods: Pod[] = [
  {
    id: "1",
    name: "Pod Alpha",
    members: {
      mediaBuyer: { id: "u1", name: "Fernando", email: "fernando@doemedia.com", role: "media_buyer" },
      strategist: { id: "u2", name: "David Adesman", email: "david@doemedia.com", role: "strategist" },
      designer: { id: "u3", name: "Karly", email: "karly@doemedia.com", role: "designer" },
      accountManager: { id: "u4", name: "Jenn Wood", email: "jenn@doemedia.com", role: "account_manager" },
      adLoader: { id: "u5", name: "Jacob", email: "jacob@doemedia.com", role: "ad_loader" },
    },
    clients: [
      { id: "c1", name: "GlowSkin Co", industry: "Skincare" },
      { id: "c2", name: "FitLife Supplements", industry: "Supplements" },
      { id: "c3", name: "VitalityPets", industry: "Pet Care" },
    ],
    clientCount: 3,
  },
  {
    id: "2",
    name: "Pod Beta",
    members: {
      mediaBuyer: null,
      strategist: null,
      designer: null,
      accountManager: null,
      adLoader: null,
    },
    clients: [
      { id: "c4", name: "UrbanThread Apparel", industry: "Fashion" },
      { id: "c5", name: "PureHome Essentials", industry: "Home & Garden" },
    ],
    clientCount: 2,
  },
];

const roleLabels: Record<string, string> = {
  mediaBuyer: "Media Buyer",
  strategist: "Strategist",
  designer: "Designer",
  accountManager: "Account Manager",
  adLoader: "Ad Loader",
};

const roleColors: Record<string, string> = {
  mediaBuyer: "bg-blue-500/20 text-blue-400",
  strategist: "bg-purple-500/20 text-purple-400",
  designer: "bg-pink-500/20 text-pink-400",
  accountManager: "bg-amber-500/20 text-amber-400",
  adLoader: "bg-green-500/20 text-green-400",
};

export default function PodsPage() {
  const [pods] = useState<Pod[]>(mockPods);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pod Management</h1>
          <p className="text-muted-foreground">
            Manage team pods — each pod handles up to 20 clients
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "Create Pod"}
        </Button>
      </div>

      {/* Create Pod Form */}
      {showCreate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Pod</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Pod Name</label>
                <input
                  type="text"
                  placeholder="e.g., Pod Gamma"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Create Pod</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pod Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {pods.map((pod) => (
          <Card key={pod.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{pod.name}</CardTitle>
                <Badge variant="secondary">
                  {pod.clientCount} / 20 clients
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Team Members */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">TEAM</h4>
                <div className="space-y-2">
                  {(Object.entries(pod.members) as [string, PodMember | null][]).map(
                    ([role, member]) => (
                      <div
                        key={role}
                        className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[role] ?? ""}`}>
                            {roleLabels[role]}
                          </span>
                        </div>
                        {member ? (
                          <span className="text-sm">{member.name}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Assigned Clients */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">CLIENTS</h4>
                {pod.clients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pod.clients.map((client) => (
                      <Badge key={client.id} variant="outline">
                        {client.name}
                        <span className="ml-1 text-muted-foreground">
                          ({client.industry})
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No clients assigned</p>
                )}
              </div>

              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Capacity</span>
                  <span>{pod.clientCount} / 20</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${(pod.clientCount / 20) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
