import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { FieldsEditor } from "@/components/admin/FieldsEditor";
import { blockDefByType, blockDefs, makeBlock, type Block, type BlockData } from "@/lib/blocks";

export function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const [open, setOpen] = useState<string | null>(blocks[0]?.id ?? null);
  const [adding, setAdding] = useState(false);

  const update = (id: string, data: BlockData) =>
    onChange(blocks.map((b) => (b.id === id ? { ...b, data } : b)));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const held = next[target]!;
    next[target] = next[index]!;
    next[index] = held;
    onChange(next);
  };

  return (
    <div className="grid gap-4">
      {blocks.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted-foreground">
          No sections yet. Add your first section below.
        </p>
      )}

      {blocks.map((block, i) => {
        const def = blockDefByType(block.type);
        const isOpen = open === block.id;
        return (
          <div key={block.id} className="rounded-2xl border border-line bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : block.id)}
                className="flex items-center gap-3 text-left"
              >
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-blue-700">{i + 1}</span>
                <span className="text-sm font-semibold text-ink">{def?.label ?? block.type}</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-40">
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === blocks.length - 1}
                  className="disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  aria-label="Duplicate section"
                  onClick={() => {
                    const clone: Block = { ...makeBlock(block.type), data: JSON.parse(JSON.stringify(block.data)) };
                    const next = [...blocks];
                    next.splice(i + 1, 0, clone);
                    onChange(next);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete section"
                  onClick={() => onChange(blocks.filter((b) => b.id !== block.id))}
                  className="hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {isOpen && def && (
              <div className="border-t border-line p-5">
                <p className="mb-5 text-xs text-muted-foreground">{def.description}</p>
                <FieldsEditor fields={def.fields} data={block.data} onChange={(data) => update(block.id, data)} />
              </div>
            )}
          </div>
        );
      })}

      {adding ? (
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="mb-4 text-sm font-semibold text-ink">Choose a section type</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {blockDefs.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => {
                  const block = makeBlock(def.type);
                  onChange([...blocks, block]);
                  setOpen(block.id);
                  setAdding(false);
                }}
                className="rounded-xl border border-line p-4 text-left transition-colors hover:border-blue-500 hover:bg-mist"
              >
                <span className="text-sm font-semibold text-ink">{def.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{def.description}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setAdding(false)} className="mt-4 text-xs font-semibold text-muted-foreground">
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-700"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      )}
    </div>
  );
}
