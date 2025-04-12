import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;