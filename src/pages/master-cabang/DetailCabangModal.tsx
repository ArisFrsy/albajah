"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  User,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Building2,
  MapIcon,
} from "lucide-react";
import { Cabang } from "@/models/Cabang";

interface DetailCabangModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Cabang | null;
}

// Helper component untuk action buttons
function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
  className = "",
}: {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default" | "secondary";
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

// Helper component untuk detail item yang lebih menarik
function DetailItem({
  icon: Icon,
  label,
  value,
  actions,
}: {
  icon?: React.ComponentType<any>;
  label: string;
  value: React.ReactNode;
  actions?: React.ReactNode;
}) {
  if (!value || value === "-") return null;

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-gray-50 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {Icon && <Icon className="h-4 w-4 text-blue-600" />}
              <p className="text-sm font-medium text-slate-600">{label}</p>
            </div>
            <div className="text-base text-slate-900 font-medium">{value}</div>
          </div>
          {actions && <div className="flex flex-col gap-2 ml-4">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DetailCabangModal({
  isOpen,
  onClose,
  data,
}: DetailCabangModalProps) {
  if (!data) return null;

  // Handler functions untuk berbagai actions
  const handleOpenMaps = () => {
    if (data.alamat) {
      const encodedAddress = encodeURIComponent(data.alamat);
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank");
    }
  };

  const handleOpenDirections = () => {
    if (data.alamat) {
      const encodedAddress = encodeURIComponent(data.alamat);
      window.open(
        `https://maps.google.com/maps?daddr=${encodedAddress}`,
        "_blank"
      );
    }
  };

  const handleWhatsApp = () => {
    if (data.noTelepon) {
      // Format nomor telepon untuk WhatsApp (hapus karakter non-digit)
      const cleanNumber = data.noTelepon.replace(/\D/g, "");
      // Jika nomor dimulai dengan 0, ganti dengan 62 (kode Indonesia)
      const formattedNumber = cleanNumber.startsWith("0")
        ? "62" + cleanNumber.slice(1)
        : cleanNumber;
      window.open(`https://wa.me/${formattedNumber}`, "_blank");
    }
  };

  const handleCall = () => {
    if (data.noTelepon) {
      window.open(`tel:${data.noTelepon}`, "_self");
    }
  };

  const handleEmail = () => {
    if (data.email) {
      window.open(`mailto:${data.email}`, "_self");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail Cabang
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-1">
                Informasi lengkap kontak dan lokasi cabang
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          {/* Informasi Lokasi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Lokasi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={Building2}
                label="Provinsi"
                value={
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {data.provinsi?.name || "-"}
                  </Badge>
                }
              />
              <DetailItem
                icon={Building2}
                label="Kabupaten/Kota"
                value={
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {data.kabupaten?.name || "-"}
                  </Badge>
                }
              />
            </div>

            <DetailItem
              icon={MapPin}
              label="Alamat Lengkap"
              value={
                <div className="text-slate-700 leading-relaxed">
                  {data.alamat || "-"}
                </div>
              }
              actions={
                data.alamat && (
                  <>
                    <ActionButton
                      icon={MapIcon}
                      label="Lihat di Maps"
                      onClick={handleOpenMaps}
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    />
                    <ActionButton
                      icon={ExternalLink}
                      label="Petunjuk Arah"
                      onClick={handleOpenDirections}
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    />
                  </>
                )
              }
            />
          </div>

          <Separator className="my-6" />

          {/* Informasi Kontak */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Kontak</h3>
            </div>

            <DetailItem
              icon={User}
              label="Penanggung Jawab"
              value={
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">
                    {data.penanggungjawab || "-"}
                  </span>
                  {data.penanggungjawab && (
                    <Badge variant="outline" className="text-xs">
                      PIC
                    </Badge>
                  )}
                </div>
              }
            />

            <DetailItem
              icon={Phone}
              label="No. Telepon"
              value={
                <div className="font-mono text-slate-700">
                  {data.noTelepon || "-"}
                </div>
              }
              actions={
                data.noTelepon && (
                  <>
                    <ActionButton
                      icon={MessageCircle}
                      label="WhatsApp"
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    />
                    <ActionButton
                      icon={Phone}
                      label="Telepon"
                      onClick={handleCall}
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    />
                  </>
                )
              }
            />

            <DetailItem
              icon={Mail}
              label="Email"
              value={
                <div className="font-mono text-slate-700">
                  {data.email || "-"}
                </div>
              }
              actions={
                data.email && (
                  <ActionButton
                    icon={Mail}
                    label="Kirim Email"
                    onClick={handleEmail}
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  />
                )
              }
            />
          </div>
        </div>

        <Separator className="my-6" />

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
