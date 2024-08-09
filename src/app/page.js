'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Head from 'next/head';
import React, { useState } from 'react';

const PantryForm = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const addItem = () => {
    const newItem = { id: Date.now(), name, quantity };
    setPantryItems([...pantryItems, newItem]);
    setName('');
    setQuantity(1);
  };

  const deleteItem = (id) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const startEditing = (id) => {
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
    <div className={styles.formContainer}>
      <h2>Pantry Items</h2>
      <input
        className={styles.input}
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item Name"
      />
      <input
        className={styles.input}
        type="number"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        min="1"
      />
      {editingId ? (
        <button className={styles.button} onClick={updateItem}>Update Item</button>
      ) : (
        <button className={styles.button} onClick={addItem}>Add Item</button>
      )}
      <ul className={styles.list}>
        {pantryItems.map(item => (
          <li key={item.id} className={styles.listItem}>
            {item.name} - {item.quantity}
            <button className={styles.editButton} onClick={() => startEditing(item.id)}>Edit</button>
            <button className={styles.deleteButton} onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pantry Tracker</title>
        <meta name="description" content="Track your pantry items easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <PantryForm />
      </main>
    </div>
  );
}


