import React from 'react';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="container">
      <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
            PK
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Knowledge<br />Base Chat</h1>
        </div>

        <FileUpload />

        <div style={{ marginTop: 'auto', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <p>Powered by LangChain & AI</p>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
}

export default App;
