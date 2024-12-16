import { PageHeader } from "@/components/dashboard/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />
      {/* Settings form will go here */}
    </div>
  );
}
