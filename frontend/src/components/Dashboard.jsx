import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { addcontact, deletecontact, getcontacts } from "../apis"; // Your API file

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for contacts
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  

  console.log(user);
  console.log(typeof user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const result = await getcontacts();
      if (result.success) {
        const mappedContacts = result.data.map((contact) => ({
          id: contact.id,
          name: contact.contact_name,
          phone: contact.contact_phone,
        }));
        setContacts(mappedContacts);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

 const handleAddContact = async () => {
   if (formData.name.trim() && formData.phone.trim()) {
     try {
       // Call API to add contact
       const result = await addcontact({
         name: formData.name.trim(),
         phonenumber: formData.phone.trim(),
       });

       if (result.success) {
         // Success - add to local state
         setContacts([
           ...contacts,
           {
             //  id: Date.now(), // Or use ID from API response
             id: result.contact.id,
             name: formData.name.trim(),
             phone: formData.phone.trim(),
           },
         ]);

         setFormData({ name: "", phone: "" });
         setShowAddForm(false);

         // Optional: Show success message
         console.log(result.message);
       } else {
         // Handle error
         console.error("Failed to add contact:", result.error);
         alert("Failed to add contact: " + result.error);
       }
     } catch (error) {
       console.error("Error adding contact:", error);
       alert("Error adding contact");
     }
   }
 };

 const handleDeleteContact = async (id) => {
   try {
     console.log("********")
     // Call the API to delete the contact
     const result = await deletecontact(id);
      console.log(result)
     if (result.success) {
       // Only update the UI if the API call was successful
       setContacts(contacts.filter((contact) => contact.id !== id));

       // Optional: Show success message
       console.log(result.message);
       // or alert(result.message);
     } else {
       // Handle API error
       console.error(result.error);
       alert(result.error);
     }
   } catch (error) {
     // Handle unexpected errors
     console.log("*");
     console.error("Error deleting contact:", error);
     alert("Failed to delete contact");
   }
 };


  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

          {user && (
            <p className="text-lg text-gray-600 mb-4">
              Welcome, {user.username}!
            </p>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>

        <hr className="my-8" />

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              My Personal Contacts
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? "Cancel" : "+ Add Contact"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white p-4 rounded-lg mb-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Add New Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddContact}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Contact
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ name: "", phone: "" });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No contacts added yet</p>
                <p className="text-sm">
                  Add your first personal contact to get started
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {contact.name}
                      </h3>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="Delete contact"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {contacts.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {contacts.length} personal contact
              {contacts.length !== 1 ? "s" : ""} total
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
