"use client";

export default function LocalFilePicker({
  onSelect,
}: {
  onSelect: (url: string) => void;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onSelect(url);
  }

  return (
    <label className="inline-block">
      <input
        type="file"
        accept="audio/*"
        hidden
        onChange={handleChange}
      />
      <span className="px-4 py-2 bg-zinc-800 rounded cursor-pointer">
        Select Local Audio
      </span>
    </label>
  );
}
