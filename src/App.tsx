import { SetStateAction, useState } from 'react'
import './App.css'
import { Box, TextField } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { AddRounded } from '@mui/icons-material';

type TItem = {
  id: number,
  name: string,
}

export default function App() {
  const [items1, setItem1] = useState<TItem[]>([{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 3, name: "C" }]);
  const [items2, setItem2] = useState<TItem[]>([{ id: 4, name: "D" }, { id: 5, name: "E" }]);
  const [drag, setDrag] = useState(false);
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
  function addItem1WithOrder(item: TItem, dropOnItem: TItem, dropOn: "top" | "bottom") {
    if (item.id === dropOnItem.id) return
    let isAlreadyExists = false;
    items1.forEach(i => { if (i.id == item.id) isAlreadyExists = true })
    if (isAlreadyExists) {
      setItem1(prev => prev.filter(i => i.id !== item.id))
    } else {
      setItem2(prev => prev.filter(i => i.id !== item.id))
    }

    setItem1(prev => {
      const newItems: TItem[] = [];
      if (dropOn === "top") {
        prev.forEach(i => {
          if (i.id === dropOnItem.id) {
            newItems.push(item);
          }
          newItems.push(i);
        });
      } else {
        prev.forEach(i => {
          newItems.push(i);
          if (i.id === dropOnItem.id) {
            newItems.push(item);
          }
        });
      }
      return newItems;
    })
  }
  function addItem2WithOrder(item: TItem, dropOnItem: TItem, dropOn: "top" | "bottom") {
    if (item.id === dropOnItem.id) return
    let isAlreadyExists = false;
    items2.forEach(i => { if (i.id == item.id) isAlreadyExists = true })
    if (isAlreadyExists) {
      setItem2(prev => prev.filter(i => i.id !== item.id))
    } else {
      setItem1(prev => prev.filter(i => i.id !== item.id))
    }

    setItem2(prev => {
      const newItems: TItem[] = [];
      if (dropOn === "top") {
        prev.forEach(i => {
          if (i.id === dropOnItem.id) {
            newItems.push(item);
          }
          newItems.push(i);
        });
      } else {
        prev.forEach(i => {
          newItems.push(i);
          if (i.id === dropOnItem.id) {
            newItems.push(item);
          }
        });
      }
      return newItems;
    })
  }
  return (
    <>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <DragBox items={items1} addItem={addItem1} setItems={setItem1} addItemWithPos={addItem1WithOrder} drag={drag} setDrag={setDrag} />
          <DragBox items={items2} addItem={addItem2} setItems={setItem2} addItemWithPos={addItem2WithOrder} drag={drag} setDrag={setDrag} />
        </Box>
      </Box>
    </>
  )
}

function DragBox(props: { items: TItem[], addItem: (item: TItem) => void, setItems: React.Dispatch<SetStateAction<TItem[]>>, addItemWithPos: (item: TItem, dropedItem: TItem, dropOn: "top" | "bottom") => void, drag: boolean, setDrag: React.Dispatch<SetStateAction<boolean>> }) {
  function handleOnDrop(e: React.DragEvent) {
    console.log("outside")
    props.setDrag(false)
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
    <div style={{ display: "flex", flexDirection: "column", padding: 10, minHeight: 50, flexGrow: 1, width: "10rem" }}>
      <div style={{ paddingBottom: "1rem", flexGrow: 1 }}>
        {props.items.map(item => <Item id={item.id} name={item.name} key={item.id} changeItem={changeItem} addItem={props.addItemWithPos} drag={props.drag} setDrag={props.setDrag} />)}
      </div>
      <div style={{ padding: 1, border: "2px solid #666", color: "#666" }} onDrop={handleOnDrop} onDragOver={handleDragOver} >
        <AddRounded />
      </div>
    </div>
  </Box>
}

function Item(props: { id: number, name: string, changeItem: (id: number, name: string) => void, addItem: (item: TItem, dropedItem: TItem, dropOn: "top" | "bottom") => void, drag: boolean, setDrag: React.Dispatch<SetStateAction<boolean>> }) {
  function handleOnDrag(e: React.DragEvent, id: number, name: string) {
    props.setDrag(true)
    e.dataTransfer.setData("item", JSON.stringify({ id: id, name: name }));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleOnDropTop(e: React.DragEvent) {
    const item = e.dataTransfer.getData("item") as string;
    console.log("top")
    props.setDrag(false)
    props.addItem(JSON.parse(item), { id: props.id, name: props.name }, "top");
  }

  function handleOnDropDown(e: React.DragEvent) {
    const item = e.dataTransfer.getData("item") as string;
    console.log("bottom")
    props.addItem(JSON.parse(item), { id: props.id, name: props.name }, "bottom");
  }
  return <div onDragStart={(e) => handleOnDrag(e, props.id, props.name)} draggable style={{ display: "flex", alignItems: "center", position: "relative" }}>
    <DragIndicatorIcon color='disabled' />
    <TextField sx={{ zIndex: 1 }} variant="standard" value={props.name} onChange={(e) => props.changeItem(props.id, e.target.value)} />
    {props.drag && <Box sx={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, zIndex: 2 }}>
      <div
        onDragOver={handleDragOver}
        style={{ height: "50%", width: "100%" }}
        onDrop={handleOnDropTop}
      ></div>
      <div
        onDragOver={handleDragOver}
        style={{ height: "50%", width: "100%" }}
        onDrop={handleOnDropDown}
      ></div>
    </Box>}
  </div>
}
