"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import QRGenerator from "@/components/qr/QRGenerator";

export default function GenerateQRPage() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Generate Attendance QR Code"
        description="Create a new attendance session"
      />

      <QRGenerator />

    </DashboardLayout>
  );
}