import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  Underline,
} from "lucide-react";
import { uploadMedia } from "@/lib/media.functions";

const exec = (command: string, value?: string) => {
  document.execCommand("styleWithCSS", false, "false");
  document.execCommand(command, false, value);
};

function ToolButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border border-line bg-background px-2 text-xs font-semibold text-ink transition-colors hover:border-blue-500 hover:text-blue-700"
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  minHeight = 260,
  label,
  help,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number | undefined;
  label?: string | undefined;
  help?: string | undefined;

}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useServerFn(uploadMedia);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only sync incoming HTML when it differs, so typing isn't interrupted.
  useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML) el.innerHTML = value || "";
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML ?? "");

  const run = (command: string, arg?: string) => {
    ref.current?.focus();
    exec(command, arg);
    emit();
  };

  const insertImage = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      const res = await upload({ data: { name: file.name, contentType: file.type, base64: btoa(binary) } });
      const alt = window.prompt("Alt text for this image (describe it for search engines and screen readers)", "") ?? "";
      const el = ref.current;
      if (el) {
        el.focus();
        const html = `<figure><img src="${res.url}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" /></figure><p><br /></p>`;
        document.execCommand("insertHTML", false, html);
        emit();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setBusy(false);
    }
  };

  const addLink = () => {
    const url = window.prompt("Link URL (https://… or /page)");
    if (url) run("createLink", url);
  };

  return (
    <div className="grid gap-2">
      {label && <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>}
      <div className="rounded-xl border border-line bg-card">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line p-2">
          <ToolButton title="Paragraph" onClick={() => run("formatBlock", "<p>")}>
            <Pilcrow className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Heading 2" onClick={() => run("formatBlock", "<h2>")}>
            <Heading2 className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Heading 3" onClick={() => run("formatBlock", "<h3>")}>
            <Heading3 className="h-3.5 w-3.5" />
          </ToolButton>
          <span className="mx-1 h-5 w-px bg-line" />
          <ToolButton title="Bold" onClick={() => run("bold")}>
            <Bold className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Italic" onClick={() => run("italic")}>
            <Italic className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Underline" onClick={() => run("underline")}>
            <Underline className="h-3.5 w-3.5" />
          </ToolButton>
          <span className="mx-1 h-5 w-px bg-line" />
          <ToolButton title="Bullet list" onClick={() => run("insertUnorderedList")}>
            <List className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Numbered list" onClick={() => run("insertOrderedList")}>
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Quote" onClick={() => run("formatBlock", "<blockquote>")}>
            <Quote className="h-3.5 w-3.5" />
          </ToolButton>
          <span className="mx-1 h-5 w-px bg-line" />
          <ToolButton title="Insert link" onClick={addLink}>
            <Link2 className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton title="Insert image with alt text" onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
          </ToolButton>
          <ToolButton title="Clear formatting" onClick={() => run("removeFormat")}>
            Clear
          </ToolButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void insertImage(f);
              e.target.value = "";
            }}
          />
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          role="textbox"
          aria-multiline="true"
          aria-label={label ?? "Rich text"}
          className="prose-editor px-4 py-3 text-sm outline-none"
          style={{ minHeight }}
        />
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
