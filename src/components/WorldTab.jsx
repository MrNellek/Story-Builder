import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const WorldTab = ({ storyId }) => {
  const [worldElements, setWorldElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'location',
    description: '',
    details: ''
  });

  useEffect(() => {
    fetchWorldElements();
  }, [storyId]);

  const fetchWorldElements = async () => {
    try {
      const { data, error } = await supabase
        .from('world_elements')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorldElements(data || []);
    } catch (error) {
      console.error('Error fetching world elements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('world_elements')
        .insert([{ ...formData, story_id: storyId }])
        .select()
        .single();

      if (error) throw error;
      setWorldElements([data, ...worldElements]);
      setFormData({
        name: '',
        type: 'location',
        description: '',
        details: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating world element:', error);
    }
  };

  const deleteWorldElement = async (elementId) => {
    if (!confirm('Are you sure you want to delete this world element?')) return;

    try {
      const { error } = await supabase
        .from('world_elements')
        .delete()
        .eq('id', elementId);

      if (error) throw error;
      setWorldElements(worldElements.filter(el => el.id !== elementId));
    } catch (error) {
      console.error('Error deleting world element:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading world elements...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">World Building</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add World Element'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="location">Location</option>
                <option value="organization">Organization</option>
                <option value="culture">Culture</option>
                <option value="magic_system">Magic System</option>
                <option value="technology">Technology</option>
                <option value="history">History</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="5"
            />
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded"
            >
              Create World Element
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {worldElements.map((element) => (
          <div
            key={element.id}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{element.name}</h3>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">
                {element.type}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{element.description}</p>
            {element.details && (
              <p className="text-gray-400 text-sm mb-4">{element.details}</p>
            )}
            <button
              onClick={() => deleteWorldElement(element.id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {worldElements.length === 0 && !showForm && (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-xl mb-4">No world elements yet</p>
          <p>Build your story's world by adding locations, cultures, and more!</p>
        </div>
      )}
    </div>
  );
};

export default WorldTab;