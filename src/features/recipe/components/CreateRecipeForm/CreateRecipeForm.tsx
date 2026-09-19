import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Flame, Snowflake, Star, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createRecipe } from '../../api/recipes';
import { ROUTES } from '@/config/routes';
import './CreateRecipeForm.css';

const recipeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().min(1, 'La description est requise'),
  stages: z.array(z.object({ value: z.string() })),
  preparationTime: z.coerce.number().min(0),
  cookingTime: z.coerce.number().min(0),
  restTime: z.coerce.number().min(0),
  part: z.coerce.number().min(1).max(20),
  note: z.coerce.number().min(1).max(10),
});

type RecipeFormInput = z.input<typeof recipeSchema>;
type RecipeFormOutput = z.output<typeof recipeSchema>;

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CreateRecipeForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormInput, unknown, RecipeFormOutput>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      stages: [{ value: '' }],
      part: 4,
      note: 5,
      preparationTime: 15,
      cookingTime: 30,
      restTime: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'stages' });

  const handleNameChange = (name: string) => {
    setValue('name', name);
    setValue('slug', generateSlug(name));
  };

  const onSubmit = async (data: RecipeFormOutput) => {
    setError('');

    const stage = data.stages.map((s) => s.value.trim()).filter((s) => s !== '');
    if (stage.length === 0) {
      setError('Ajoutez au moins une étape de préparation');
      return;
    }

    try {
      await createRecipe({
        name: data.name,
        slug: data.slug,
        description: data.description,
        stage,
        part: data.part,
        note: data.note,
        preparationTime: data.preparationTime,
        cookingTime: data.cookingTime,
        restTime: data.restTime,
      });
      navigate(ROUTES.RECIPES);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="recipe-form" noValidate>
      <h2>Créer une recette</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Nom de la recette *</label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Tarte aux pommes"
          disabled={isSubmitting}
          {...register('name', { onChange: (e) => handleNameChange(e.target.value) })}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="slug">
          URL (slug) *
          <span className="hint">Généré automatiquement, modifiable</span>
        </label>
        <input
          id="slug"
          type="text"
          placeholder="tarte-aux-pommes"
          disabled={isSubmitting}
          {...register('slug')}
        />
        {errors.slug && <span className="field-error">{errors.slug.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          placeholder="Décrivez votre recette..."
          rows={4}
          disabled={isSubmitting}
          {...register('description')}
        />
        {errors.description && <span className="field-error">{errors.description.message}</span>}
      </div>

      <div className="form-group">
        <label>
          Étapes de préparation *
          <span className="hint">Ajoutez autant d'étapes que nécessaire</span>
        </label>

        <div className="stages-list">
          {fields.map((field, index) => (
            <div key={field.id} className="stage-item">
              <span className="stage-number">{index + 1}.</span>
              <textarea
                placeholder={`Étape ${index + 1}`}
                rows={2}
                disabled={isSubmitting}
                {...register(`stages.${index}.value` as const)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="remove-stage-btn"
                  disabled={isSubmitting}
                  title="Supprimer cette étape"
                  aria-label="Supprimer cette étape"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ value: '' })}
          disabled={isSubmitting}
        >
          Ajouter une étape
        </Button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preparationTime"><Clock size={16} /> Préparation (min) *</label>
          <input id="preparationTime" type="number" min="0" disabled={isSubmitting} {...register('preparationTime')} />
          {errors.preparationTime && <span className="field-error">{errors.preparationTime.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cookingTime"><Flame size={16} /> Cuisson (min) *</label>
          <input id="cookingTime" type="number" min="0" disabled={isSubmitting} {...register('cookingTime')} />
          {errors.cookingTime && <span className="field-error">{errors.cookingTime.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="restTime"><Snowflake size={16} /> Repos (min)</label>
          <input id="restTime" type="number" min="0" disabled={isSubmitting} {...register('restTime')} />
          {errors.restTime && <span className="field-error">{errors.restTime.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="part"><Users size={16} /> Portions *</label>
          <input id="part" type="number" min="1" max="20" disabled={isSubmitting} {...register('part')} />
          {errors.part && <span className="field-error">{errors.part.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="note"><Star size={16} /> Difficulté (1-10) *</label>
          <input id="note" type="number" min="1" max="10" disabled={isSubmitting} {...register('note')} />
          {errors.note && <span className="field-error">{errors.note.message}</span>}
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTES.RECIPES)}
          disabled={isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Création...' : 'Créer la recette'}
        </Button>
      </div>
    </form>
  );
}
