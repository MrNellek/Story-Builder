import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import CharactersTab from '../components/CharactersTab';
import WorldTab from '../components/WorldTab';
import LoreTab from '../components/LoreTab';

const Workspace = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [activeTab, setActiveTab] = useState('characters');
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (error) throw error;
      setStory(data);
    } catch (error) {
      console.error('Error fetching story:', error);
      navigate('/stories');
    } finally {
      setLoading(false);
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

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Story not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/stories')}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Stories
              </button>
              <h1 className="text-2xl font-bold">{story.title}</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('characters')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'characters'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Characters
            </button>
            <button
              onClick={() => setActiveTab('world')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'world'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              World
            </button>
            <button
              onClick={() => setActiveTab('lore')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lore'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Lore
            </button>
          </nav>
        </div>

        <div className="tab-content">
          {activeTab === 'characters' && <CharactersTab storyId={storyId} />}
          {activeTab === 'world' && <WorldTab storyId={storyId} />}
          {activeTab === 'lore' && <LoreTab storyId={storyId} />}
        </div>
      </div>
    </div>
  );
};

export default Workspace;