import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />


      <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          Profile
        </h2>


        <div className="mt-6 grid gap-5">

          <div>

            <label className="mb-2 block text-xs font-medium">
              Full Name
            </label>

            <input
              defaultValue="John Teacher"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            />

          </div>


          <div>

            <label className="mb-2 block text-xs font-medium">
              Email
            </label>

            <input
              defaultValue="john.teacher@school.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            />

          </div>


          <div>

            <label className="mb-2 block text-xs font-medium">
              School Name
            </label>

            <input
              defaultValue="Coding School"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            />

          </div>


          <div className="flex justify-end">

            <Button>
              Save Changes
            </Button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}