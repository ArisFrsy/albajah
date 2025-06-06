// components/ui/combobox.tsx

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, // Tambahkan CommandList untuk best practice aksesibilitas
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ComboBoxItem {
    value: string | number;
    label: string;
}

interface ComboboxProps {
    items: ComboBoxItem[];
    value: string | number | undefined; // Value bisa jadi undefined saat awal
    onChange: (_value: ComboBoxItem) => void;
    placeholder?: string;
    selectPlaceholder?: string; // Placeholder untuk tombol
    searchPlaceholder?: string; // Placeholder untuk input pencarian
}

export function Combobox({
    items,
    value,
    onChange,
    selectPlaceholder = 'Pilih item...',
    searchPlaceholder = 'Cari item...'
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Menangani kasus jika value null atau undefined
    const selectedItem = value !== undefined && value !== null
        ? items.find((item) => item.value.toString() === value.toString())
        : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedItem?.label || selectPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                    {/* Bungkus CommandGroup dengan CommandList */}
                    <CommandList>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label} // Value di CommandItem sebaiknya string unik (label) untuk pencarian
                                    onSelect={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedItem?.value.toString() === item.value.toString()
                                                ? 'opacity-100'
                                                : 'opacity-0'
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