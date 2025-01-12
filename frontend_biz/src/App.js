import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import CreateUser from './components/customer/CreateUser'; // Import the CreateUser component
import DisplayUsers from './components/customer/DisplayUsers'; // Import the DisplayUsers component
import EditUser from './components/customer/EditUser'; // Import the EditUsers component
import CreateOwner from './components/owner/CreateOwner'; // import the CreateOwner component
import DisplayOwner from './components/owner/DisplayOwner'; // Import the DisplayOwner component
import EditOwner from './components/owner/EditOwner'; // Import the EditOwner component
import CreateInvoice from './components/invoice/CreateInvoice'; // Import the invoice component
import DisplayInvoice from './components/invoice/DisplayInvoice'; // Import the invoice component
import EditInvoice from './components/invoice/EditInvoice'; // Import the invoice component
import AllSales from './components/allsales/AllSales'; // Import the invoice component
import CreateProduct from './components/product/CreateProduct'; // Import the register component
import CreateService from './components/service/CreateService'; // Import the register component
import Register from './components/user/Register'; // Import the register component
import Login from './components/user/Login'; // Import the register component


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route to create a new user */}
          <Route path="/" element={<Register />} />

           {/* Route to login a user */}
           <Route path="/users/login_user" element={<Login />} />

          {/* Route to display users */}
          <Route path="/users/save_user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/users/display_users" element={<ProtectedRoute><DisplayUsers /></ProtectedRoute>} />
          <Route path="/users/edit_user/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />

          {/* Route to create a new owner */}
          <Route path="/owner/create_owner" element={<ProtectedRoute><CreateOwner /></ProtectedRoute>} />  {/* Changed the path here */}

          {/* Route to display owners */}
          <Route path="/owner/display_owner" element={<ProtectedRoute><DisplayOwner /></ProtectedRoute>} />
          <Route path="/owner/edit_owner/:id" element={<ProtectedRoute><EditOwner /></ProtectedRoute>} />

          {/* Route to display invoices */}
          <Route path="/invoice/create_invoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
          <Route path="/invoice/display_invoices" element={<ProtectedRoute><DisplayInvoice /></ProtectedRoute>} />
          <Route path="/invoice/edit_invoice/:id" element={<ProtectedRoute><EditInvoice /></ProtectedRoute>} />

          {/* Route to display all sales */}
          <Route path="/sales" element={<ProtectedRoute><AllSales /></ProtectedRoute>} />

          {/* Route to display products */}
          <Route path="/products" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />

          {/* Route to display services */}
          <Route path="/services" element={<ProtectedRoute><CreateService /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
