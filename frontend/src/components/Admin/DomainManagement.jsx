import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DomainManagement = () => {
  const [domains, setDomains] = useState([]);
  const [sections, setSections] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [newSection, setNewSection] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSection, setEditSection] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('userToken');

  const fetchDomains = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/domains`);
      setDomains(res.data);
    } catch (err) {
      setDomains([]);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sections`);
      setSections(res.data);
    } catch (err) {
      setSections([]);
    }
  };

  useEffect(() => {
    fetchDomains();
    fetchSections();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDomain.trim() || !newSection) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/domains`,
        { name: newDomain, section: newSection },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewDomain('');
      setNewSection('');
      fetchDomains();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add domain');
    }
  };

  const handleEdit = (id, name, section) => {
    setEditId(id);
    setEditName(name);
    setEditSection(section);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editSection) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/domains/${editId}`,
        { name: editName, section: editSection },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditName('');
      setEditSection('');
      fetchDomains();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update domain');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain? This action will also delete ALL courses associated with this domain and cannot be undone.')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/domains/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDomains();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete domain');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Domain Management</h2>
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          placeholder="New domain name"
          className="border p-2 rounded flex-1"
          required
        />
        <select
          value={newSection}
          onChange={e => setNewSection(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        >
          <option value="">Select section</option>
          {sections.map(section => (
            <option key={section._id} value={section._id}>{section.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y">
        {domains.map(domain => (
          <li key={domain._id} className="py-2 flex items-center justify-between">
            {editId === domain._id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border p-2 rounded flex-1"
                  required
                />
                <select
                  value={editSection}
                  onChange={e => setEditSection(e.target.value)}
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select section</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>{section.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
              </form>
            ) : (
              <>
                <span>{domain.name} - {domain.section?.name || 'No section'}</span>
                <div>
                  <button onClick={() => handleEdit(domain._id, domain.name, domain.section?._id || domain.section)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(domain._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DomainManagement; 