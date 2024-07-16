import { useState } from 'react'
import './App.css'
import { Box, TextField } from '@mui/material';

export default function App() {
  const [items1, setItem1] = useState<string[]>(["A", "B", "C"]);
  const [items2, setItem2] = useState<string[]>(["D", "E"]);
  function addItem1(item: string) {
    setItem1([...items1, item]);
    setItem2(items2.filter(i => i !== item));
  }
  function addItem2(item: string) {
    setItem2([...items2, item]);
    setItem1(items1.filter(i => i !== item));
  }
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <DragBox items={items1} addItem={addItem1} />
          <DragBox items={items2} addItem={addItem2} />
        </Box>
      </Box>
    </>
  )
}

function DragBox(props: { items: string[], addItem: (item: string) => void }) {
  function handleOnDrop(e: React.DragEvent) {
    const item = e.dataTransfer.getData("item") as string;
    console.log("widgetType", item)
    props.addItem(item);
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  return <Box sx={{ backgroundColor: "gray" }}>
    <div onDrop={handleOnDrop} onDragOver={handleDragOver} style={{ width: 40, padding: 10, minHeight: 50 }}>
      {props.items.map(item => <Item name={item} key={item} />)}
    </div>
  </Box>
}

function Item(props: { name: string }) {
  function handleOnDrag(e: React.DragEvent, item: string) {
    e.dataTransfer.setData("item", item);
  }
  return <div onDragStart={(e) => handleOnDrag(e, props.name)} draggable>
    <TextField value={props.name} />
  </div>
}
