import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Heart, 
  Clock, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Play, 
  Pause, 
  Radio, 
  Check, 
  X, 
  Headphones, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { useAudio } from '../context/AudioContext';
import { USER_PROFILE, CATEGORIES } from '../data/sampleAudio';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { spots, deleteSpot, toggleVisibility, updateSpot } = useSpots();
  const { currentSpot, isPlaying, playSpot } = useAudio();

  const [activeTab, setActiveTab] = useState('My Audio Spots');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Published', 'Draft'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSpot, setEditingSpot] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    category: 'History',
    location: '',
    description: '',
    status: 'Published'
  });

  // Filtered recordings
  const userSpots = useMemo(() => {
    return spots.filter((spot) => {
      // Status filter
      const matchStatus = 
        statusFilter === 'All' || 
        spot.status?.toLowerCase() === statusFilter.toLowerCase();

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = 
        !q ||
        spot.title.toLowerCase().includes(q) ||
        spot.location.toLowerCase().includes(q) ||
        spot.category.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [spots, statusFilter, searchQuery]);

  const publishedCount = spots.filter((s) => s.status === 'Published').length;
  const draftCount = spots.filter((s) => s.status === 'Draft').length;

  // Open Edit Modal
  const handleOpenEdit = (spot) => {
    setEditingSpot(spot);
    setEditForm({
      title: spot.title,
      category: spot.category,
      location: spot.location,
      description: spot.description,
      status: spot.status
    });
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingSpot) return;

    updateSpot(editingSpot.id, {
      title: editForm.title,
      category: editForm.category,
      location: editForm.location,
      description: editForm.description,
      status: editForm.status,
      visibility: editForm.status === 'Published' ? 'Public' : 'Private'
    });

    setEditingSpot(null);
  };

  // Handle Delete
  const handleConfirmDelete = (id) => {
    deleteSpot(id);
    setDeleteConfirmId(null);
  };

  const sidebarMenuItems = [
    { name: 'My Audio Spots', icon: Radio, count: spots.length },
    { name: 'Liked Spots', icon: Heart, count: USER_PROFILE.likedCount },
    { name: 'Listening History', icon: Clock },
    { name: 'My Locations', icon: MapPin },
    { name: 'Edit Profile', icon: User },
    { name: 'Settings', icon: Settings },
    { name: 'Log Out', icon: LogOut, isDanger: true }
  ];

  return (
    <div className="page-dashboard">
      <div className="container dashboard-container">
        <div className="dashboard-grid-layout">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="dashboard-sidebar card">
            {/* User Profile Card */}
            <div className="dashboard-user-card">
              <div className="user-avatar-wrap">
                <img src={USER_PROFILE.avatar} alt={USER_PROFILE.name} className="user-avatar-img" />
                <span className="online-indicator" />
              </div>
              <h3 className="user-name">{USER_PROFILE.name}</h3>
              <span className="user-email">{USER_PROFILE.email}</span>
              <p className="user-bio">{USER_PROFILE.bio}</p>
              
              <button 
                type="button" 
                className="btn btn-outline btn-sm edit-profile-btn"
                onClick={() => setActiveTab('Edit Profile')}
              >
                Edit Profile
              </button>
            </div>

            <hr className="sidebar-divider" />

            {/* Sidebar Navigation Items */}
            <nav className="dashboard-sidebar-nav">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'active' : ''} ${item.isDanger ? 'item-danger' : ''}`}
                    onClick={() => {
                      if (item.name === 'Log Out') {
                        if (window.confirm('Are you sure you want to log out?')) {
                          navigate('/');
                        }
                      } else {
                        setActiveTab(item.name);
                      }
                    }}
                  >
                    <Icon size={18} className="sidebar-item-icon" />
                    <span className="sidebar-item-label">{item.name}</span>
                    {item.count !== undefined && (
                      <span className="sidebar-item-count">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ================= MAIN CONTENT AREA ================= */}
          <main className="dashboard-main-content">
            {/* Main Header */}
            <div className="dashboard-header-row">
              <div>
                <h1 className="dashboard-heading">My Audio Spots</h1>
                <p className="dashboard-subheading">
                  Manage your recorded geographic stories, drafts, and visibility settings.
                </p>
              </div>

              <Link to="/create" className="btn btn-primary create-spot-btn">
                <Plus size={18} />
                <span>Create New Spot</span>
              </Link>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="dashboard-toolbar card">
              {/* Status Tab Filters */}
              <div className="status-tabs-group">
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('All')}
                >
                  All ({spots.length})
                </button>
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'Published' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Published')}
                >
                  Published ({publishedCount})
                </button>
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'Draft' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Draft')}
                >
                  Drafts ({draftCount})
                </button>
              </div>

              {/* Search Field */}
              <div className="dashboard-search-input">
                <Search size={16} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search your audio spots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="dash-clear-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Recordings List / Table */}
            <div className="dashboard-recordings-list card">
              {userSpots.length === 0 ? (
                <div className="dashboard-empty-state">
                  <Radio size={40} className="empty-icon" />
                  <h3>No audio recordings found</h3>
                  <p>Create your first geofenced audio story to share with travelers.</p>
                  <Link to="/create" className="btn btn-primary mt-2">
                    <Plus size={16} /> Create an Audio Spot
                  </Link>
                </div>
              ) : (
                <div className="recordings-table-wrap">
                  <div className="recordings-table-head">
                    <span className="col-spot">Audio Recording</span>
                    <span className="col-category">Category</span>
                    <span className="col-status">Status</span>
                    <span className="col-visibility">Visibility</span>
                    <span className="col-actions">Actions</span>
                  </div>

                  <div className="recordings-table-body">
                    {userSpots.map((spot) => {
                      const isCurrentPlaying = currentSpot?.id === spot.id && isPlaying;
                      const isPublished = spot.status === 'Published';

                      return (
                        <div key={spot.id} className="recording-row-item">
                          {/* Spot details */}
                          <div className="col-spot spot-info-cell">
                            <div className="row-thumb-wrap">
                              <img src={spot.image} alt={spot.title} className="row-thumb" />
                              <button
                                type="button"
                                className={`row-play-btn ${isCurrentPlaying ? 'playing' : ''}`}
                                onClick={() => playSpot(spot)}
                                title={isCurrentPlaying ? 'Pause' : 'Play'}
                              >
                                {isCurrentPlaying ? (
                                  <Pause size={14} fill="#ffffff" />
                                ) : (
                                  <Play size={14} fill="#ffffff" />
                                )}
                              </button>
                            </div>
                            <div className="row-text-meta">
                              <Link to={`/stories/${spot.id}`} className="row-title">
                                {spot.title}
                              </Link>
                              <div className="row-sub">
                                <span><MapPin size={12} /> {spot.location}</span>
                                <span>• {spot.distance}</span>
                                <span>• {spot.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Category */}
                          <div className="col-category">
                            <span className={`badge badge-${spot.category.toLowerCase()}`}>
                              {spot.category}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="col-status">
                            <span className={`badge ${isPublished ? 'badge-published' : 'badge-draft'}`}>
                              {spot.status}
                            </span>
                          </div>

                          {/* Visibility Toggle Switch */}
                          <div className="col-visibility">
                            <button
                              type="button"
                              className={`visibility-toggle-switch ${spot.visibility === 'Public' ? 'is-public' : 'is-private'}`}
                              onClick={() => toggleVisibility(spot.id)}
                              title={`Click to set ${spot.visibility === 'Public' ? 'Private' : 'Public'}`}
                            >
                              <span className="switch-slider" />
                              <span className="switch-text">
                                {spot.visibility === 'Public' ? 'Public' : 'Private'}
                              </span>
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="col-actions actions-cell">
                            <button
                              type="button"
                              className="action-icon-btn edit-btn"
                              onClick={() => handleOpenEdit(spot)}
                              title="Edit spot"
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              type="button"
                              className="action-icon-btn delete-btn"
                              onClick={() => setDeleteConfirmId(spot.id)}
                              title="Delete spot"
                            >
                              <Trash2 size={16} />
                            </button>

                            <Link
                              to={`/stories/${spot.id}`}
                              className="action-icon-btn view-btn"
                              title="View Story Page"
                            >
                              <ExternalLink size={16} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Edit Spot Modal */}
      {editingSpot && (
        <div className="modal-overlay" onClick={() => setEditingSpot(null)}>
          <div className="modal-card edit-spot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Audio Spot: {editingSpot.title}</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setEditingSpot(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="edit-form-body">
              <div className="form-group">
                <label className="form-label">Spot Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Private)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location Name</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Historical Description</label>
                <textarea
                  rows="4"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingSpot(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Audio Spot</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className="delete-modal-text">
              Are you sure you want to permanently delete this audio recording? This action cannot be undone.
            </p>
            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleConfirmDelete(deleteConfirmId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
