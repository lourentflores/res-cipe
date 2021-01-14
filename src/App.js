import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export default function App() {
  const [state, setState] = useState({ userId: null, isLoggedIn: false });

  return (
    <div>
      {state.isLoggedIn ? (
        <Dashboard userId={state.userId} />
      ) : (
        <Login setState={setState} />
      )}
    </div>
  );
}
