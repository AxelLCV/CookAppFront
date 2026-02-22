import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { createRecipe } from '../../api/recipes';
import type { CreateRecipeInput } from '../../types/recipes';
import { ROUTES } from '@/config/routes';
import './CreateRecipeForm.css';

export function CreateRecipeForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateRecipeInput>({
    slug: '',
    name: '',
    description: '',
    stage: [''],  // ← Commencer avec une étape vide
    images: [],
    part: 4,
    note: 5,
    preparationTime: 15,
    cookingTime: 30,
    restTime: 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  // Ajouter une étape
  const addStage = () => {
    setFormData({
      ...formData,
      stage: [...formData.stage, ''],
    });
  };

  // Modifier une étape
  const updateStage = (index: number, value: string) => {
    const newStages = [...formData.stage];
    newStages[index] = value;
    setFormData({
      ...formData,
      stage: newStages,
    });
  };

  // Supprimer une étape
  const removeStage = (index: number) => {
    if (formData.stage.length > 1) {
      const newStages = formData.stage.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        stage: newStages,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Filtrer les étapes vides
    const dataToSend = {
      ...formData,
      stage: formData.stage.filter(s => s.trim() !== ''),
    };

    // Validation : au moins une étape
    if (dataToSend.stage.length === 0) {
      setError('Ajoutez au moins une étape de préparation');
      setIsLoading(false);
      return;
    }

    try {
      await createRecipe(dataToSend);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>Créer une recette</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Nom */}
      <div className="form-group">
        <label htmlFor="name">Nom de la recette *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ex: Tarte aux pommes"
          required
          disabled={isLoading}
        />
      </div>

      {/* Slug */}
      <div className="form-group">
        <label htmlFor="slug">
          URL (slug) *
          <span className="hint">Généré automatiquement, modifiable</span>
        </label>
        <input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="tarte-aux-pommes"
          required
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Décrivez votre recette..."
          rows={4}
          required
          disabled={isLoading}
        />
      </div>

      {/* Étapes (array) */}
      <div className="form-group">
        <label>
          Étapes de préparation *
          <span className="hint">Ajoutez autant d'étapes que nécessaire</span>
        </label>
        
        <div className="stages-list">
          {formData.stage.map((stage, index) => (
            <div key={index} className="stage-item">
              <span className="stage-number">{index + 1}.</span>
              <textarea
                value={stage}
                onChange={(e) => updateStage(index, e.target.value)}
                placeholder={`Étape ${index + 1}`}
                rows={2}
                disabled={isLoading}
              />
              {formData.stage.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStage(index)}
                  className="remove-stage-btn"
                  disabled={isLoading}
                  title="Supprimer cette étape"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          onClick={addStage}
          disabled={isLoading}
        >
          ➕ Ajouter une étape
        </Button>
      </div>

      {/* Temps */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preparationTime">⏱️ Préparation (min) *</label>
          <input
            id="preparationTime"
            type="number"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cookingTime">🔥 Cuisson (min) *</label>
          <input
            id="cookingTime"
            type="number"
            value={formData.cookingTime}
            onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
            min="0"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="restTime">🧊 Repos (min)</label>
          <input
            id="restTime"
            type="number"
            value={formData.restTime}
            onChange={(e) => setFormData({ ...formData, restTime: parseInt(e.target.value) || 0 })}
            min="0"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Portions et Note */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="part">👥 Portions *</label>
          <input
            id="part"
            type="number"
            value={formData.part}
            onChange={(e) => setFormData({ ...formData, part: parseInt(e.target.value) || 1 })}
            min="1"
            max="20"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">⭐ Difficulté (1-10) *</label>
          <input
            id="note"
            type="number"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: parseInt(e.target.value) || 5 })}
            min="1"
            max="10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="form-actions">
        <Button 
          variant="secondary"
          onClick={() => navigate(ROUTES.RECIPES)}
          disabled={isLoading}
        >
          Annuler
        </Button>
        
        <Button 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Création...' : 'Créer la recette'}
        </Button>
      </div>
    </form>
  );
}