import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CharactersTab = ({ storyId }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    race: '',
    class: '',
    background: '',
    personality: '',
    appearance: '',
    abilities: '',
    backstory: ''
  });

  useEffect(() => {
    fetchCharacters();
  }, [storyId]);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('characters')
        .insert([{ ...formData, story_id: storyId }])
        .select()
        .single();

      if (error) throw error;
      setCharacters([data, ...characters]);
      setFormData({
        name: '',
        description: '',
        race: '',
        class: '',
        background: '',
        personality: '',
        appearance: '',
        abilities: '',
        backstory: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const deleteCharacter = async (characterId) => {
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId);

      if (error) throw error;
      setCharacters(characters.filter(char => char.id !== characterId));
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading characters...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Characters</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Character'}
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Race</label>
              <input
                type="text"
                value={formData.race}
                onChange={(e) => setFormData({...formData, race: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Background</label>
              <input
                type="text"
                value={formData.background}
                onChange={(e) => setFormData({...formData, background: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Personality</label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({...formData, personality: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Appearance</label>
            <textarea
              value={formData.appearance}
              onChange={(e) => setFormData({...formData, appearance: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Abilities</label>
            <textarea
              value={formData.abilities}
              onChange={(e) => setFormData({...formData, abilities: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Backstory</label>
            <textarea
              value={formData.backstory}
              onChange={(e) => setFormData({...formData, backstory: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded"
            >
              Create Character
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
        {characters.map((character) => (
          <div
            key={character.id}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-2">{character.name}</h3>
            {character.race && <p className="text-gray-400 mb-1">Race: {character.race}</p>}
            {character.class && <p className="text-gray-400 mb-1">Class: {character.class}</p>}
            {character.background && <p className="text-gray-400 mb-3">Background: {character.background}</p>}
            {character.description && <p className="text-gray-300 mb-4">{character.description}</p>}
            <button
              onClick={() => deleteCharacter(character.id)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {characters.length === 0 && !showForm && (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-xl mb-4">No characters yet</p>
          <p>Create your first character to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CharactersTab;