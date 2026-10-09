import React, { useState } from 'react';
import { Plus, Check, Trash2, Crosshair, Pin } from 'lucide-react';
import { playTickSound, triggerHaptic } from '../utils/audio';

export function TaskReminders({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) {
  const [newTitle, setNewTitle] = useState('');
  const [estimatedCount, setEstimatedCount] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      id: Date.now().toString(),
      title: newTitle.trim(),
      estimatedPoms: estimatedCount,
      completedPoms: 0,
      completed: false
    });
    setNewTitle('');
    playTickSound(0.2);
  };

  return (
    <div className="tasks-card glass-panel">
      <div className="tasks-header">
        <div className="tasks-title-group">
          <span className="tasks-subtitle">REMINDERS</span>
          <h3 className="tasks-title">Focus Tasks</h3>
        </div>
        <span className="tasks-badge">
          {tasks.filter(t => t.completed).length}/{tasks.length} Done
        </span>
      </div>

      {/* Task input form */}
      <form onSubmit={handleSubmit} className="task-add-form">
        <div className="task-input-wrapper">
          <input
            type="text"
            className="task-text-input"
            placeholder="Add task for this session..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="task-est-select" title="Estimated Pomodoros">
            <span>🍅</span>
            <select
              value={estimatedCount}
              onChange={(e) => setEstimatedCount(Number(e.target.value))}
              className="est-dropdown"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="task-add-submit-btn press-scale"
          disabled={!newTitle.trim()}
          title="Add Task"
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="tasks-empty-state">
            <p>No tasks yet. Add what you plan to accomplish in this sprint.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isActive = task.id === activeTaskId;
            return (
              <div
                key={task.id}
                className={`task-row ${task.completed ? 'is-completed' : ''} ${isActive ? 'is-active-target' : ''}`}
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  className={`task-checkbox press-scale ${task.completed ? 'checked' : ''}`}
                  onClick={() => {
                    playTickSound(0.25);
                    triggerHaptic(15);
                    onToggleTask(task.id);
                  }}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
                >
                  {task.completed && <Check size={12} strokeWidth={3} />}
                </button>

                {/* Title & metadata */}
                <div
                  className="task-info"
                  onClick={() => {
                    playTickSound(0.15);
                    onSelectActiveTask(task.id);
                  }}
                  title="Click to set as current focus target"
                >
                  <span className="task-title-text">{task.title}</span>
                  <div className="task-meta-row">
                    <span className="task-pom-count">
                      🍅 {task.completedPoms}/{task.estimatedPoms}
                    </span>
                    {isActive && (
                      <span className="current-focus-tag">
                        Current Focus
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="task-row-actions">
                  <button
                    type="button"
                    className={`task-pin-btn press-scale ${isActive ? 'pinned' : ''}`}
                    onClick={() => {
                      playTickSound(0.15);
                      onSelectActiveTask(isActive ? null : task.id);
                    }}
                    title={isActive ? 'Unpin from Dynamic Island' : 'Pin to Dynamic Island'}
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    type="button"
                    className="task-delete-btn press-scale"
                    onClick={() => {
                      playTickSound(0.2);
                      onDeleteTask(task.id);
                    }}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
