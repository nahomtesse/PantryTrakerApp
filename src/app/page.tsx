'use client'
import Image from "next/image";
import Styles from './page.module.css';
import Head from 'next/head';
import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import Script from 'next/script';

type PantryItem = {
  id: number;
  name: string;
  quantity: number;
};

interface PantryFormProps {
  pantryItems: PantryItem[];
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
}

const PantryForm: React.FC<PantryFormProps> = ({ pantryItems, setPantryItems }) => {
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  const addItem = () => {
    const newItem = { id: Date.now(), name, quantity };
    setPantryItems([...pantryItems, newItem]);
    setName('');
    setQuantity(1);
  };

  const deleteItem = (id: number) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const startEditing = (id: number) => {
    const item = pantryItems.find(item => item.id === id);
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setEditingId(id);
    }
  };

  const updateItem = () => {
    setPantryItems(
      pantryItems.map(item =>
        item.id === editingId ? { ...item, name, quantity } : item
      )
    );
    setName('');
    setQuantity(1);
    setEditingId(null);
  };

  return (
    <div className={Styles.formContainer}>
      <h2>Pantry Items</h2>
      <input
        className={Styles.input}
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item Name"
      />
      <input
        className={Styles.input}
        type="number"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        min="1"
      />
      {editingId ? (
        <button className={Styles.button} onClick={updateItem}>Update Item</button>
      ) : (
        <button className={Styles.button} onClick={addItem}>Add Item</button>
      )}
      <ul className={Styles.list}>
        {pantryItems.map(item => (
          <li key={item.id} className={Styles.listItem}>
            {item.name} - {item.quantity}
            <button className={Styles.editButton} onClick={() => startEditing(item.id)}>Edit</button>
            <button className={Styles.deleteButton} onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  }

  React.useEffect(() => {
    const results = pantryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchQuery, pantryItems]);

  return (
    <div className={Styles.container}>
      <Script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js" />
      <Head>
        <title>Pantry Tracker</title>
        <meta name="description" content="Track your pantry items easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={Styles.header}>
        <label className={Styles.
          searchContainer}>Search
          <input className={Styles.input} 
            type="text" 
            value={searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search items" />
        </label>
      </header>
      <main className={Styles.main}>
        <PantryForm pantryItems={filteredItems} setPantryItems={setPantryItems}/>
      </main>
    </div>
  );
}



