import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSections, createSection, updateSection, deleteSection } from '../../redux/slices/sectionsSlice';

const SectionManagement = () => {
  const dispatch = useDispatch();
  const { sections, loading, error } = useSelector(state => state.sections);
  const [newSection, setNewSection] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSection.trim()) {
      dispatch(createSection({ name: newSection }));
      setNewSection('');
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (editName.trim()) {
      dispatch(updateSection({ id: editId, sectionData: { name: editName } }));
      setEditId(null);
      setEditName('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      dispatch(deleteSection(id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Section Management</h2>
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newSection}
          onChange={e => setNewSection(e.target.value)}
          placeholder="New section name"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="divide-y">
        {sections.map(section => (
          <li key={section._id} className="py-2 flex items-center justify-between">
            {editId === section._id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
              </form>
            ) : (
              <>
                <span>{section.name}</span>
                <div>
                  <button onClick={() => handleEdit(section._id, section.name)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(section._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionManagement; 