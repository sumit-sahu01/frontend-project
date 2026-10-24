import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  MapPin, 
  Upload, 
  Music, 
  Image as ImageIcon, 
  Navigation, 
  Info, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle,
  FileAudio,
  Sparkles
} from 'lucide-react';
import { useSpots } from '../context/SpotsContext';
import { CATEGORIES } from '../data/sampleAudio';
import { MapView } from '../components/MapView';

export const CreateAudio = () => {
  const navigate = useNavigate();
  const { addSpot, userLocation, requestUserLocation } = useSpots();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'History',
    tags: '',
    lat: userLocation?.lat?.toFixed(6) || '26.925000',
    lng: userLocation?.lng?.toFixed(6) || '75.824000',
    locationName: 'Jaipur, Rajasthan',
    audioFile: null,
    audioFileName: '',
    audioDuration: '3:45',
    imageFile: null,
    imagePreview: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Provide at least 20 characters of background story';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Step 2 Validation
  const validateStep2 = () => {
    const newErrors = {};
    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      newErrors.lat = 'Enter a valid latitude (-90 to 90)';
    }
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      newErrors.lng = 'Enter a valid longitude (-180 to 180)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Stepper Navigation
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Use My Location action
  const handleUseMyLocation = async () => {
    const loc = await requestUserLocation();
    if (loc?.lat) {
      setFormData((prev) => ({
        ...prev,
        lat: loc.lat.toFixed(6),
        lng: loc.lng.toFixed(6)
      }));
    }
  };

  // Handle map click coordinate pick
  const handleMapCoordSelect = ({ lat, lng }) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
  };

  // Audio file upload simulation
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
        setErrors((prev) => ({ ...prev, audio: 'Please upload an MP3 or WAV audio file' }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        audioFile: file,
        audioFileName: file.name
      }));
      setErrors((prev) => ({ ...prev, audio: '' }));
    }
  };

  // Image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Final Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdSpot = addSpot({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        lat: formData.lat,
        lng: formData.lng,
        location: formData.locationName,
        image: formData.imagePreview,
        duration: formData.audioDuration
      });

      setIsSubmitting(false);
      setUploadSuccess(true);

      setTimeout(() => {
        navigate(`/stories/${createdSpot.id}`);
      }, 1400);
    }, 1000);
  };

  const steps = [
    { num: 1, title: 'Details' },
    { num: 2, title: 'Location' },
    { num: 3, title: 'Upload & Review' }
  ];

  return (
    <div className="page-create-audio">
      <div className="container create-container">
        {/* Header */}
        <div className="create-page-header text-center">
          <span className="section-eyebrow">Creator Studio</span>
          <h1 className="create-main-title">Create a New Audio Spot</h1>
          <p className="create-subtitle">
            Share location-based stories and cultural lore with listeners around the world.
          </p>
        </div>

        {/* 3-Step Progress Stepper */}
        <div className="create-stepper-wrapper">
          <div className="stepper-progress-track">
            <div 
              className="stepper-progress-fill" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }} 
            />
          </div>

          <div className="stepper-steps">
            {steps.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className={`step-item ${isCurrent ? 'active' : ''} ${isPassed ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {isPassed ? <Check size={16} /> : s.num}
                  </div>
                  <span className="step-label">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="create-form-card card">
          <form onSubmit={handleSubmit}>
            {/* ================= STEP 1: DETAILS ================= */}
            {currentStep === 1 && (
              <div className="step-content-pane">
                <div className="step-pane-header">
                  <h3>Step 1: Spot Details</h3>
                  <p>Provide general information and category for the audio recording.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Spot Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Secrets of Hawa Mahal's Wind Windows"
                    className={errors.title ? 'input-error' : ''}
                  />
                  {errors.title && <span className="error-text"><AlertCircle size={13} /> {errors.title}</span>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="locationName" className="form-label">Location / City Landmark</label>
                    <input
                      type="text"
                      id="locationName"
                      name="locationName"
                      value={formData.locationName}
                      onChange={handleChange}
                      placeholder="e.g. Jaipur, Rajasthan"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Story & Historical Description <span className="req">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell the history, architecture secrets, or personal story connected to this location..."
                    className={errors.description ? 'input-error' : ''}
                  />
                  {errors.description && <span className="error-text"><AlertCircle size={13} /> {errors.description}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="tags" className="form-label">Tags (Optional)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Architecture, Royal, Fort, Sunset (comma-separated)"
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 2: LOCATION ================= */}
            {currentStep === 2 && (
              <div className="step-content-pane">
                <div className="step-pane-header">
                  <h3>Step 2: Geographic Coordinates</h3>
                  <p>Choose the exact spot where audio playback should be triggered.</p>
                </div>

                {/* Helpful Location Accuracy Tip */}
                <div className="location-accuracy-tip">
                  <Info size={18} className="tip-icon" />
                  <div className="tip-text">
                    <strong>Optimal Proximity Range:</strong> For the best walking experience, place your pin within 50–100 meters of the primary viewpoint or landmark entrance.
                  </div>
                </div>

                <div className="coord-inputs-row">
                  <div className="form-group flex-1">
                    <label htmlFor="lat" className="form-label">Latitude</label>
                    <input
                      type="text"
                      id="lat"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      className={errors.lat ? 'input-error' : ''}
                    />
                    {errors.lat && <span className="error-text">{errors.lat}</span>}
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="lng" className="form-label">Longitude</label>
                    <input
                      type="text"
                      id="lng"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      className={errors.lng ? 'input-error' : ''}
                    />
                    {errors.lng && <span className="error-text">{errors.lng}</span>}
                  </div>

                  <div className="use-location-col">
                    <button
                      type="button"
                      className="btn btn-secondary use-my-loc-btn"
                      onClick={handleUseMyLocation}
                    >
                      <Navigation size={15} />
                      <span>Use My Location</span>
                    </button>
                  </div>
                </div>

                {/* Embedded Interactive Map Picker */}
                <div className="create-map-picker-box">
                  <MapView
                    selectable={true}
                    selectedLocation={{ lat: formData.lat, lng: formData.lng }}
                    onLocationSelect={handleMapCoordSelect}
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 3: UPLOAD & REVIEW ================= */}
            {currentStep === 3 && (
              <div className="step-content-pane">
                <div className="step-pane-header">
                  <h3>Step 3: Upload Audio & Review</h3>
                  <p>Upload your recorded story and verify the audio spot card preview.</p>
                </div>

                {/* Audio File Upload Box */}
                <div className="form-group">
                  <label className="form-label">
                    Audio Narration File (MP3 / WAV) <span className="req">*</span>
                  </label>
                  <label className="upload-dropzone">
                    <input
                      type="file"
                      accept=".mp3,.wav,.ogg,.m4a"
                      onChange={handleAudioUpload}
                      className="hidden-file-input"
                    />
                    <div className="dropzone-content">
                      <div className="dropzone-icon-wrap">
                        <Upload size={24} />
                      </div>
                      <span className="dropzone-main-text">
                        {formData.audioFileName ? (
                          <strong className="uploaded-file-name">
                            <FileAudio size={18} /> {formData.audioFileName}
                          </strong>
                        ) : (
                          'Click to browse or drag & drop audio recording'
                        )}
                      </span>
                      <span className="dropzone-sub-text">
                        Supports MP3, WAV up to 50MB (Stereo recommended)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Cover Image Upload */}
                <div className="form-group">
                  <label className="form-label">Cover Image (Optional)</label>
                  <label className="upload-dropzone compact">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden-file-input"
                    />
                    <div className="dropzone-content horizontal">
                      <ImageIcon size={20} />
                      <span>Upload Landmark Photo (or keep default)</span>
                    </div>
                  </label>
                </div>

                {/* Live Card Preview */}
                <div className="create-preview-section">
                  <h4 className="preview-heading">Card Preview for Listeners</h4>
                  <div className="preview-card-wrap">
                    <div className="preview-audio-spot-card">
                      <img src={formData.imagePreview} alt="Preview" className="preview-thumb" />
                      <div className="preview-info">
                        <span className={`badge badge-${formData.category.toLowerCase()}`}>
                          {formData.category}
                        </span>
                        <h4>{formData.title || 'Your Spot Title'}</h4>
                        <p className="preview-loc">📍 {formData.locationName} • Coordinates: {formData.lat}, {formData.lng}</p>
                        <p className="preview-snippet">
                          {formData.description ? `${formData.description.slice(0, 110)}...` : 'Your story description will appear here...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {uploadSuccess && (
                  <div className="upload-success-alert">
                    <Check size={20} />
                    <span>Audio Spot published successfully! Redirecting to story...</span>
                  </div>
                )}
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="create-form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/explore')}
              >
                Cancel
              </button>

              <div className="actions-right">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleBack}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    <span>Next: {steps[currentStep].title}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Publishing Spot...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Upload Audio Spot</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
