import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const LoreTab = ({ storyId }) => {
  const [loreEntries, setLoreEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'myth',
    content: '',
    tags: ''
  });

  useEffect(() => {
    fetchLoreEntries();
  }, [storyId]);

  const fetchLoreEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('lore_entries')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoreEntries(data || []);
    } catch (error) {
      console.error('Error fetching lore entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('lore_entries')
        .insert([{
          ...formData,
          story_id: storyId,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }])
        .select()
        .single();

      if (error) throw error;
      setLoreEntries([data, ...loreEntries]);
      setFormData({
        title: '',
        category: 'myth',
        content: '',
        tags: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating lore entry:', error);
    }
  };

  const deleteLoreEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this lore entry?')) return;

    try {
      const { error } = await supabase
        .from('lore_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      setLoreEntries(loreEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting lore entry:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading lore entries...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lore & Mythology</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Lore Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="myth">Myth</option>
                <option value="legend">Legend</option>
                <option value="history">History</option>
                <option value="prophecy">Prophecy</option>
                <option value="ritual">Ritual</option>
                <option value="artifact">Artifact</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="6"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., ancient, magic, prophecy"
            />
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded"
            >
              Create Lore Entry
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
        {loreEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{entry.title}</h3>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">
                {entry.category}
              </span>
            </div>
            <p className="text-gray-300 mb-4">{entry.content}</p>
            {entry.tags && entry.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-indigo-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => deleteLoreEntry(entry.id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {loreEntries.length === 0 && !showForm && (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-xl mb-4">No lore entries yet</p>
          <p>Add myths, legends, and historical events to enrich your story!</p>
        </div>
      )}
    </div>
  );
};

export default LoreTab;