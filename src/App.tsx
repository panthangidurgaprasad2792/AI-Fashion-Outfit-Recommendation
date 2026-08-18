import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Wardrobe } from './pages/Wardrobe';
import { Profile } from './pages/Profile';
import { OutfitBuilder } from './pages/OutfitBuilder';
import { Stylist } from './pages/Stylist';
import { SavedLooks } from './pages/SavedLooks';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="wardrobe" element={<Wardrobe />} />
            <Route path="profile" element={<Profile />} />
            <Route path="builder" element={<OutfitBuilder />} />
            <Route path="stylist" element={<Stylist />} />
            <Route path="saved" element={<SavedLooks />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
