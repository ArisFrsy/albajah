'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useIndoRegion } from './UseIndoRegion';
import { Combobox } from '@/components/ui/combobox';
import { Cabang } from '@/models/Cabang';
import Loading from '@/components/Spinner';

interface EditCabangModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { cabang: Cabang }) => void;
    initialData: Cabang | null;
}

export default function EditCabangModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: EditCabangModalProps) {
    const [penganggungJawab, setPenganggungJawab] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [noTelepon, setNoTelepon] = useState<string>('');
    const [listProvinsi, setListProvinsi] = useState<{ value: number; label: string }[]>([]);
    const [listKabupaten, setListKabupaten] = useState<{ value: number; label: string }[]>([]);

    const { provinces, regencies, selectedProvince, loading, setLoading, setSelectedProvince, selectedRegency, setSelectedRegency } = useIndoRegion();

    useEffect(() => {
        if (provinces.length > 0) {
            const provinceOptions = provinces.map((province) => ({
                value: parseInt(province.id),
                label: province.name,
            }));
            setListProvinsi(provinceOptions);
        }
    }, [provinces]);

    useEffect(() => {
        if (selectedProvince) {
            const regencyOptions = regencies.map((regency) => ({
                value: parseInt(regency.id),
                label: regency.name,
            }));
            setListKabupaten(regencyOptions);
        } else {
            setListKabupaten([]);
        }
    }, [selectedProvince, regencies]);

    useEffect(() => {
        if (initialData) {
            console.log('Initial Data:', initialData);
            setPenganggungJawab(initialData.penanggungjawab || '');
            setEmail(initialData.email || '');
            setNoTelepon(initialData.noTelepon || '');
            if (initialData) {
                setSelectedProvince(initialData.idProvinsi);
            }
            if (initialData.regencies) {
                setSelectedRegency(initialData.idKabupaten);
            }
        }
    }, [initialData, setSelectedProvince, setSelectedRegency]);

    const handleSubmit = () => {
        if (!selectedProvince || !selectedRegency) {
            alert('Please select a province and a regency');
            return;
        }

        const updatedCabang: Cabang = {
            idCabang: initialData?.idCabang || undefined,
            idProvinsi: selectedProvince.toString(),
            idKabupaten: selectedRegency.toString(),
            penanggungjawab: penganggungJawab,
            email,
            noTelepon,
        };
        onSubmit({ cabang: updatedCabang });
        setSelectedProvince('');
        setSelectedRegency('');
        setPenganggungJawab('');
        setEmail('');
        setNoTelepon('');
        onClose();
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Cabang</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Label htmlFor="province">Provinsi</Label>
                        <Combobox
                            items={listProvinsi}
                            value={selectedProvince}
                            onChange={(value) => setSelectedProvince(value.value.toString())}
                            placeholder="Pilih Provinsi"
                        />
                        <Label htmlFor="regency">Kabupaten</Label>
                        <Combobox
                            items={listKabupaten}
                            value={selectedRegency}
                            onChange={(value) => setSelectedRegency(value.value.toString())}
                            placeholder="Pilih Kabupaten"
                        />
                        <Label htmlFor="penganggungJawab">Penanggung Jawab</Label>
                        <Input
                            id="penganggungJawab"
                            value={penganggungJawab}
                            onChange={(e) => setPenganggungJawab(e.target.value)}
                        />
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Label htmlFor="noTelepon">No Telepon</Label>
                        <Input
                            id="noTelepon"
                            type="tel"
                            value={noTelepon}
                            onChange={(e) => setNoTelepon(e.target.value)}
                        />

                        <Button className="mt-4" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );

}
