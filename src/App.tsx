import {
  Accessor,
  For,
  createComputed,
  createMemo,
  createSignal,
  type Component,
} from "solid-js";
import data from "./assets/data.json";

const App: Component = () => {
  const [text, setText] = createSignal("");
  const items = createMemo(() => {
    return data.filter((item) => {
      if (text()[0] === "^") {
        return (
          normalizeText(item.name_yomi).startsWith(
            normalizeText(text().slice(1))
          ) ||
          normalizeText(item.name).startsWith(normalizeText(text().slice(1)))
        );
      }
      return (
        normalizeText(item.name).includes(normalizeText(text())) ||
        normalizeText(item.name_yomi).includes(normalizeText(text())) ||
        normalizeText(item.artist_name).includes(normalizeText(text()))
      );
    });
  });
  const list = createMemo(() => {
    return <For each={items()}>{(item) => <ListItem item={item} />}</For>;
  });

  return (
    <>
      <aside class="p-4 max-w-lg mx-auto sticky top-0 bg-white/50 backdrop-blur-sm z-10">
        <input
          class="flex bg-slate-100 border border-slate-300 px-3 py-2 rounded h-10 placeholder:text-slate-600 text-slate-900 focus-within:border-accent outline-none w-full"
          value={text()}
          onInput={(e) => {
            setText(e.currentTarget.value);
          }}
        />
      </aside>
      <div class="p-4 pt-0 max-w-lg mx-auto overflow-auto h-[calc(100dvh-4.5rem)]">
        {list()}
      </div>
    </>
  );
};

export default App;

function ListItem({
  item: { name, artist_name },
}: {
  item: {
    name: string;
    artist_name: string;
  };
}) {
  return (
    <div
      role="listitem"
      class="py-2 border-b border-slate-300 last:border-b-0 w-full h-16"
    >
      <div class="font-medium text-lg truncate">{name}</div>
      <div class="text-sm text-slate-600 truncate">{artist_name}</div>
    </div>
  );
}

function normalizeText(text: string) {
  let ret = text.toLowerCase();

  // convert hiragana to katakana
  ret = ret.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });

  return ret;
}
