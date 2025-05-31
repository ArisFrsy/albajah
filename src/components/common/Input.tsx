// Reusable Input Component
export function Input({
    label,
    type = 'text',
    value,
    onChange,
    required = false,
}: {
    label: string;
    type?: string;
    value: any;
    onChange: (val: any) => void;
    required?: boolean;
}) {
    return (
        <div>
            <label className="block mb-1 text-gray-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                required={required}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
            />
        </div>
    );
}

// Reusable Textarea Component
export function Textarea({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
}) {
    return (
        <div>
            <label className="block mb-1 text-gray-700">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 text-gray-900 h-24 resize-none"
            />
        </div>
    );
}