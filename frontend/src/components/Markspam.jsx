import React, { useState, useEffect, useContext } from "react";
import { Search, Flag, AlertTriangle, Shield } from "lucide-react";
import { getGlobalContacts, markNumberAsSpam } from "../apis";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

const Markspam = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [topSpamNumbers, setTopSpamNumbers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMarkingSpam, setIsMarkingSpam] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

   const handleLogout = () => {
     logout();
     navigate("/");
   };

  useEffect(() => {
    fetchGlobalContacts();
  }, []);

  const fetchGlobalContacts = async () => {
    setLoading(true);
    const result = await getGlobalContacts();

    if (result.success) {
      setTopSpamNumbers(result.data);
      setError("");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const getSpamBadge = (likelihood) => {
    if (likelihood >= 70) return "bg-red-100 text-red-800";
    if (likelihood >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Search in the fetched data
      const foundContact = topSpamNumbers.find(
        (contact) => contact.phoneNumber === searchQuery.trim()
      );

      if (foundContact) {
        setSearchResult({
          number: foundContact.phoneNumber,
          name: foundContact.name,
          spamLikelihood: foundContact.spamLikelihood,
          reports: foundContact.totalSpamReports,
          isRegistered: foundContact.isRegistered,
        });
      } else {
        setSearchResult({
          number: searchQuery,
          name: "Unknown",
          spamLikelihood: 0,
          reports: 0,
          isRegistered: false,
        });
      }
    }
  };

const handleMarkSpam = async (number) => {
  setIsMarkingSpam(true);
  const result = await markNumberAsSpam(number);

  if (result.success) {
    alert(
      `Successfully marked ${number} as spam! Total reports: ${result.data.totalSpamReports}`
    );

    // Update the search result if it matches the marked number
    if (searchResult && searchResult.number === number) {
      setSearchResult({
        ...searchResult,
        reports: result.data.totalSpamReports,
        spamLikelihood: result.data.spamLikelihood,
      });
    }

    fetchGlobalContacts(); // Refresh data
  } else {
    alert(`Failed to mark as spam: ${result.message}`);
  }
  setIsMarkingSpam(false);
};
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">
            Spam Detection System
          </h1>
        </div>
        <p className="text-gray-600">Search and report spam phone numbers</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
      {/* Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("search")}
        >
          Search & Report
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "database"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("database")}
        >
          Spam Database
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Search & Report Phone Number
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter phone number..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

          {searchResult && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Search Result</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold">{searchResult.number}</p>
                  <p className="text-gray-600">{searchResult.name}</p>
                  <p className="text-sm text-gray-500">
                    {searchResult.reports} reports
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchResult.isRegistered
                      ? "Registered User"
                      : "Not Registered"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSpamBadge(
                      searchResult.spamLikelihood
                    )}`}
                  >
                    {searchResult.spamLikelihood}% Spam Risk
                  </span>

                  <button
                    onClick={() => handleMarkSpam(searchResult.number)}
                    disabled={isMarkingSpam}
                    className="ml-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Flag size={16} />
                    {isMarkingSpam ? "Marking..." : "Mark as Spam"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Database Tab */}
      {activeTab === "database" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Global Spam Database</h2>
          {topSpamNumbers.length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            <div className="space-y-3">
              {topSpamNumbers.map((contact, index) => (
                <div
                  key={contact.id || index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{contact.phoneNumber}</p>
                    <p className="text-sm text-gray-600">{contact.name}</p>
                    <p className="text-sm text-gray-500">
                      {contact.totalSpamReports} reports
                    </p>
                    <p className="text-sm text-gray-500">
                      {contact.isRegistered
                        ? "Registered User"
                        : "Not Registered"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSpamBadge(
                      contact.spamLikelihood
                    )}`}
                  >
                    {contact.spamLikelihood}% Spam Risk
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Markspam;
