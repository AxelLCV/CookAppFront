import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
import { useHousehold } from '../../hooks';
import {
  createHousehold,
  updateHousehold,
  deleteHousehold,
  addHouseholdMember,
  removeHouseholdMember,
} from '../../api/households';
import './HouseholdManager.css';

export function HouseholdManager() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { households, currentHousehold, setCurrentHousehold, refresh } = useHousehold();

  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const myMembership = currentHousehold?.members.find((member) => member.userId === user?.id);
  const isOwner = myMembership?.role === 'OWNER';

  const reportError = (err: unknown) => {
    setError(err instanceof Error ? err.message : t('household.genericError'));
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const name = newHouseholdName.trim();
    if (!name) return;

    setError('');
    setIsCreating(true);
    try {
      const household = await createHousehold({ name });
      await refresh();
      setCurrentHousehold(household.id);
      setNewHouseholdName('');
    } catch (err) {
      reportError(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRename = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentHousehold || !renameInputRef.current) return;
    const name = renameInputRef.current.value.trim();
    if (!name || name === currentHousehold.name) return;

    setError('');
    setIsRenaming(true);
    try {
      await updateHousehold(currentHousehold.id, { name });
      await refresh();
    } catch (err) {
      reportError(err);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!currentHousehold) return;
    setError('');
    setIsDeleting(true);
    try {
      await deleteHousehold(currentHousehold.id);
      await refresh();
    } catch (err) {
      reportError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentHousehold) return;
    const username = newMemberUsername.trim();
    if (!username) return;

    setError('');
    setIsAddingMember(true);
    try {
      await addHouseholdMember(currentHousehold.id, username);
      await refresh();
      setNewMemberUsername('');
    } catch (err) {
      reportError(err);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentHousehold) return;
    setError('');
    try {
      await removeHouseholdMember(currentHousehold.id, userId);
      await refresh();
    } catch (err) {
      reportError(err);
    }
  };

  return (
    <section className="household-manager">
      <h2>{t('household.title')}</h2>

      {error && <div className="field-error">{error}</div>}

      {households.length > 0 && (
        <div className="household-list">
          {households.map((household) => (
            <button
              key={household.id}
              type="button"
              className={`household-chip${household.id === currentHousehold?.id ? ' household-chip-active' : ''}`}
              onClick={() => setCurrentHousehold(household.id)}
            >
              {household.name}
            </button>
          ))}
        </div>
      )}

      <form className="household-inline-form" onSubmit={handleCreate}>
        <input
          type="text"
          value={newHouseholdName}
          onChange={(e) => setNewHouseholdName(e.target.value)}
          placeholder={t('household.newHouseholdPlaceholder')}
          disabled={isCreating}
        />
        <Button type="submit" variant="secondary" disabled={isCreating || !newHouseholdName.trim()}>
          <Plus size={16} /> {t('household.create')}
        </Button>
      </form>

      {currentHousehold && (
        <div className="household-detail">
          {isOwner ? (
            <form className="household-inline-form" onSubmit={handleRename} key={currentHousehold.id}>
              <input type="text" ref={renameInputRef} defaultValue={currentHousehold.name} disabled={isRenaming} />
              <Button type="submit" variant="secondary" disabled={isRenaming}>
                {t('household.rename')}
              </Button>
            </form>
          ) : (
            <h3 className="household-detail-title">{currentHousehold.name}</h3>
          )}

          <ul className="household-members">
            {currentHousehold.members.map((member) => (
              <li key={member.userId} className="household-member">
                <span className="household-member-name">
                  {member.role === 'OWNER' && <Crown size={14} />}
                  {member.user.username}
                </span>
                {(isOwner || member.userId === user?.id) && (
                  <button
                    type="button"
                    className="household-member-remove"
                    onClick={() => handleRemoveMember(member.userId)}
                    aria-label={member.userId === user?.id ? t('household.leave') : t('household.removeMember')}
                    title={member.userId === user?.id ? t('household.leave') : t('household.removeMember')}
                  >
                    <X size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <form className="household-inline-form" onSubmit={handleAddMember}>
            <input
              type="text"
              value={newMemberUsername}
              onChange={(e) => setNewMemberUsername(e.target.value)}
              placeholder={t('household.addMemberPlaceholder')}
              disabled={isAddingMember}
            />
            <Button type="submit" variant="secondary" disabled={isAddingMember || !newMemberUsername.trim()}>
              <UserPlus size={16} /> {t('household.addMember')}
            </Button>
          </form>

          {isOwner && (
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 size={16} /> {t('household.delete')}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
