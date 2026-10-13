"use client";

import { useState, useTransition } from "react";
import { updateUserAccountType, type AccountType } from "@/lib/admin-actions";

const OPTIONS: { value: AccountType; label: string }[] = [
  { value: "gratuit", label: "Gratuit" },
  { value: "essentiel", label: "Essentiel" },
  { value: "flex", label: "Flex" },
];

export default function AccountTypeSelect({ userId, initialValue }: { userId: string; initialValue: string | null }) {
  const [value, setValue] = useState<AccountType>((initialValue as AccountType) ?? "gratuit");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const handleChange = (next: AccountType) => {
    const previous = value;
    setValue(next);
    setError(false);
    startTransition(async () => {
      try {
        await updateUserAccountType(userId, next);
      } catch {
        setValue(previous);
        setError(true);
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as AccountType)}
        className="rounded-full bg-violet-royal/8 text-violet-royal text-xs font-medium px-2.5 py-1 ring-1 ring-violet-royal/20 focus:outline-none focus:ring-2 focus:ring-violet-royal disabled:opacity-50 cursor-pointer"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-[11px] text-brand-error">Échec</span>}
    </div>
  );
}
