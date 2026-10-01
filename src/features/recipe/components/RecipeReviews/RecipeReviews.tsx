import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { getReviews, upsertReview, deleteReview } from '../../api/reviews';
import type { Review } from '../../types/review';
import './RecipeReviews.css';

type RecipeReviewsProps = {
  slug: string;
};

type LoadState = 'loading' | 'error' | 'ready';

export function RecipeReviews({ slug }: RecipeReviewsProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [note, setNote] = useState(5);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const myReview = reviews.find((review) => review.userId === user?.id) ?? null;

  const fetchReviews = () => {
    setState('loading');
    getReviews(slug)
      .then(({ data, meta }) => {
        setReviews(data);
        setAverage(meta.average);
        setTotal(meta.total);
        const mine = data.find((review) => review.userId === user?.id);
        if (mine) {
          setNote(mine.note);
          setDescription(mine.description);
        }
        setState('ready');
      })
      .catch(() => setState('error'));
  };

  useEffect(() => {
    const run = async () => {
      fetchReviews();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await upsertReview(slug, { note, description });
      fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('recipeForm.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteReview(slug);
      setNote(5);
      setDescription('');
      fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('recipeForm.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="recipe-detail-section recipe-reviews">
      <h2>
        <Star size={18} fill="currentColor" /> {t('recipeDetail.reviewsTitle')}
        {average !== null && (
          <span className="recipe-reviews-average">
            {average.toFixed(1)}/5 · {t('recipeDetail.reviewsCount', { count: total })}
          </span>
        )}
      </h2>

      <form className="recipe-review-form" onSubmit={handleSubmit}>
        <label htmlFor="review-note">{t('recipeDetail.reviewNoteLabel')}</label>
        <input
          id="review-note"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={note}
          onChange={(e) => setNote(Number(e.target.value))}
          disabled={isSubmitting}
        />

        <label htmlFor="review-description">{t('recipeDetail.reviewDescriptionLabel')}</label>
        <textarea
          id="review-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          placeholder={t('recipeDetail.reviewDescriptionPlaceholder')}
        />

        {error && <div className="field-error">{error}</div>}

        <div className="recipe-review-form-actions">
          <Button type="submit" variant="primary" disabled={isSubmitting || !description.trim()}>
            {myReview ? t('recipeDetail.updateReview') : t('recipeDetail.addReview')}
          </Button>
          {myReview && (
            <button
              type="button"
              className="recipe-review-delete-btn"
              onClick={handleDelete}
              disabled={isSubmitting}
              aria-label={t('recipeDetail.deleteReview')}
              title={t('recipeDetail.deleteReview')}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </form>

      {state === 'ready' && reviews.length === 0 && (
        <p className="recipe-reviews-empty">{t('recipeDetail.reviewsEmpty')}</p>
      )}

      {state === 'ready' && reviews.length > 0 && (
        <ul className="recipe-reviews-list">
          {reviews.map((review) => (
            <li key={review.userId} className="recipe-review-item">
              <div className="recipe-review-item-header">
                <span className="recipe-review-author">{review.user.username}</span>
                <span className="recipe-review-note">
                  <Star size={14} fill="currentColor" /> {review.note}/5
                </span>
              </div>
              <p className="recipe-review-description">{review.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
