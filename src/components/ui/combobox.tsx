// components/ui/combobox.tsx

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Interface untuk setiap item dalam combobox
interface ComboBoxItem {
    value: string | number;
    label: string;
}

// Interface untuk props komponen Combobox
interface ComboboxProps {
    items: ComboBoxItem[];
    // Value bisa string tunggal atau string dengan koma untuk multiple
    value?: string;
    // onChange mengembalikan string value yang baru
    onChange: (_value: string) => void;
    // Tipe 'single' atau 'multiple'
    type?: 'single' | 'multiple';
    selectPlaceholder?: string;
    searchPlaceholder?: string;
}

export function Combobox({
    items,
    value,
    onChange,
    type = 'single', // Default ke 'single'
    selectPlaceholder = 'Pilih item...',
    searchPlaceholder = 'Cari item...'
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Menggunakan useMemo untuk mengurai value string menjadi array hanya saat value berubah
    const selectedValues = React.useMemo(
        () => (value ? value.split(',') : []),
        [value]
    );

    // Fungsi untuk menangani pemilihan item
    const handleSelect = (item: ComboBoxItem) => {
        const itemValueStr = item.value.toString();

        if (type === 'multiple') {
            // Buat Set dari nilai-nilai yang sudah ada untuk mempermudah manipulasi
            const newSelectedValues = new Set(selectedValues);
            if (newSelectedValues.has(itemValueStr)) {
                // Jika sudah ada, hapus
                newSelectedValues.delete(itemValueStr);
            } else {
                // Jika belum ada, tambahkan
                newSelectedValues.add(itemValueStr);
            }
            // Gabungkan kembali menjadi string dengan koma dan panggil onChange
            onChange(Array.from(newSelectedValues).join(','));
        } else {
            // Untuk mode single, langsung panggil onChange dan tutup popover
            onChange(itemValueStr);
            setOpen(false);
        }
    };

    // Fungsi untuk menghapus item di mode multiple (digunakan pada badge)
    const handleRemove = (itemValue: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah trigger Popover saat menghapus badge
        const newSelectedValues = selectedValues.filter(v => v !== itemValue);
        onChange(newSelectedValues.join(','));
    };

    // Menentukan teks yang akan ditampilkan pada tombol trigger
    const getDisplayValue = () => {
        if (type === 'multiple') {
            if (selectedValues.length === 0) return selectPlaceholder;

            // Tampilkan dalam bentuk badge untuk UX yang lebih baik
            return (
                <div className="flex flex-wrap gap-1">
                    {items
                        .filter(item => selectedValues.includes(item.value.toString()))
                        .map(item => (
                            <Badge
                                variant="secondary"
                                key={item.value}
                                className="mr-1"
                                onClick={(e) => handleRemove(item.value.toString(), e)}
                            >
                                {item.label}
                                <X className="ml-1 h-3 w-3 cursor-pointer" />
                            </Badge>
                        ))
                    }
                </div>
            );
        }

        // Logika untuk mode single
        const selectedItem = items.find(item => item.value.toString() === value);
        return selectedItem?.label || selectPlaceholder;
    };

    // Fungsi untuk memeriksa apakah suatu item dipilih
    const isSelected = (item: ComboBoxItem): boolean => {
        return selectedValues.includes(item.value.toString());
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto" // Atur tinggi otomatis untuk badge
                >
                    <div className="truncate">{getDisplayValue()}</div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={() => handleSelect(item)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            isSelected(item) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}