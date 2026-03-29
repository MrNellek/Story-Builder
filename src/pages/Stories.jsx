import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (e) => {
    e.preventDefault();
    if (!newStoryTitle.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([{ title: newStoryTitle.trim(), user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setStories([data, ...stories]);
      setNewStoryTitle('');
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setCreating(false);
    }
  };

  const deleteStory = async (storyId) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;
      setStories(stories.filter(story => story.id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Stories</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={createStory} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newStoryTitle}
              onChange={(e) => setNewStoryTitle(e.target.value)}
              placeholder="Enter story title..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={creating || !newStoryTitle.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                Created: {new Date(story.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/workspace/${story.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm"
                >
                  Open
                </button>
                <button
                  onClick={() => deleteStory(story.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <p className="text-xl mb-4">No stories yet</p>
            <p>Create your first story to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;