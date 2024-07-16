import { SetStateAction, useState } from 'react'
import './App.css'
import { Box, TextField } from '@mui/material';

type TItem = {
  id: number,
  name: string,
}

export default function App() {
  const [items1, setItem1] = useState<TItem[]>([{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 3, name: "C" }]);
  const [items2, setItem2] = useState<TItem[]>([{ id: 4, name: "D" }, { id: 5, name: "E" }]);
  function addItem1(item: TItem) {
    let isAlreadyExists = false;
    items1.forEach(i => { if (i.id == item.id) isAlreadyExists = true })
    if (isAlreadyExists) return;
    setItem1([...items1, item]);
    setItem2(items2.filter(i => i.id !== item.id));
  }
  function addItem2(item: TItem) {
    let isAlreadyExists = false;
    items2.forEach(i => { if (i.id == item.id) isAlreadyExists = true })
    if (isAlreadyExists) return;
    setItem2([...items2, item]);
    setItem1(items1.filter(i => i.id !== item.id));
  }
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <DragBox items={items1} addItem={addItem1} setItems={setItem1} />
          <DragBox items={items2} addItem={addItem2} setItems={setItem2} />
        </Box>
      </Box>
    </>
  )
}

function DragBox(props: { items: TItem[], addItem: (item: TItem) => void, setItems: React.Dispatch<SetStateAction<TItem[]>> }) {
  function handleOnDrop(e: React.DragEvent) {
    const item = e.dataTransfer.getData("item") as string;
    props.addItem(JSON.parse(item));
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function changeItem(id: number, name: string) {
    props.setItems(items => items.map(item => id === item.id ? { ...item, name: name } : item))
  }
  return <Box sx={{ backgroundColor: "gray", display: "flex", flexDirection: "column" }}>
    <div onDrop={handleOnDrop} onDragOver={handleDragOver} style={{ padding: 10, minHeight: 50, flexGrow: 1 , width: "10rem"}}>
      {props.items.map(item => <Item id={item.id} name={item.name} key={item.id} changeItem={changeItem} />)}
    </div>
  </Box>
}

function Item(props: { id: number, name: string, changeItem: (id: number, name: string) => void }) {
  function handleOnDrag(e: React.DragEvent, id: number, name: string) {
    e.dataTransfer.setData("item", JSON.stringify({ id: id, name: name }));
  }

  return <div onDragStart={(e) => handleOnDrag(e, props.id, props.name)} draggable>
    <TextField value={props.name} onChange={(e) => props.changeItem(props.id, e.target.value)} />
  </div>
}
