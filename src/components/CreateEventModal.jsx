import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, MapPin, X, 
  Rocket, Plus, ShieldCheck, Image as ImageIcon, 
  UploadCloud, Trash2, AlertTriangle 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';
import { uploadEventCoverImageToSupabase } from '../services/supabase';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const CreateEventModal = () => {
  const { closeModal, addNewEvent, user, lang } = useApp();
  const imageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    description: '',
    date: '18 Мая 2026',
    time: '18:00 - 20:30',
    location: 'г. Тараз, коворкинг Zhambyl Hub',
    locationShort: 'Zhambyl Hub, Тараз',
    hasProjects: true,
    categoryName: 'Pizza Pitch'
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    setImageError('');
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Пожалуйста, выберите файл изображения (JPG, PNG, WebP)');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setImageError(`Размер картинки (${sizeMb} MB) превышает лимит 5 MB.`);
      return;
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    hapticFeedback.impact('light');
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setImageError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shortDesc.trim()) return;

    setIsSubmitting(true);
    hapticFeedback.impact('heavy');

    let finalImageUrl = '';

    if (selectedImageFile) {
      const uploadRes = await uploadEventCoverImageToSupabase(selectedImageFile, user.id);
      if (uploadRes.success) {
        finalImageUrl = uploadRes.url;
      }
    }

    await addNewEvent({
      ...formData,
      imageUrl: finalImageUrl,
      status: user.role === 'moderator' ? 'approved' : 'pending',
      createdBy: user.id
    });

    setIsSubmitting(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="modal-handle-bar"></div>

        {/* Header */}
        <div className="modal-header-box">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {lang === 'ru' ? 'Создать мероприятие Hub' : 'Жаңа іс-шара құру'}
            </h2>
            <p className="text-xs text-[#9da7ba] leading-relaxed">
              Заполните параметры события для публикации в календаре.
            </p>
          </div>

          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[rgba(186,214,247,0.08)] hover:bg-[rgba(186,214,247,0.16)] text-[#9da7ba] hover:text-white flex items-center justify-center transition-colors shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Fields with Guaranteed 20px-24px Gaps */}
        <form onSubmit={handleSubmit} className="modal-body-form no-scrollbar">
          <div className="form-group">
            <label className="form-label">Формат / Тип мероприятия *</label>
            <select
              value={formData.categoryName}
              onChange={(e) => {
                const cat = e.target.value;
                setFormData({ 
                  ...formData, 
                  categoryName: cat,
                  hasProjects: cat === 'Pizza Pitch' || cat === 'Хакатон' || cat === 'Demo Day'
                });
              }}
              className="glass-input text-xs bg-[#090c1a] font-medium text-white"
            >
              <option value="Pizza Pitch">Pizza Pitch (Питчинг с пиццей и нетворкингом)</option>
              <option value="Хакатон">Хакатон (Hackathon & Defense)</option>
              <option value="Demo Day">Demo Day & Pitch Battle</option>
              <option value="Воркшоп">Воркшоп / Мастер-класс</option>
              <option value="Митап">Митап / Нетворкинг-встреча</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Название мероприятия *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Friday Pizza Pitch Vol. 5"
              className="glass-input text-xs"
            />
          </div>

          {/* Event Cover Image Upload File Selector */}
          <div className="form-group">
            <div className="flex items-center justify-between">
              <label className="form-label !mb-0 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#663af3]" />
                <span>Картина / Обложка мероприятия</span>
              </label>
              <span className="text-[10px] text-[#80cbc4] font-mono">Лимит: 5 MB</span>
            </div>

            <input
              type="file"
              ref={imageInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {imageError && (
              <p className="text-[11px] text-[#ffab91] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{imageError}</span>
              </p>
            )}

            {!imagePreviewUrl ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(186,215,247,0.18)] hover:border-[#663af3] bg-[rgba(186,214,247,0.02)] rounded-3xl p-5 text-center cursor-pointer transition-all space-y-1.5"
              >
                <UploadCloud className="w-8 h-8 text-[#663af3] mx-auto" />
                <p className="text-xs font-semibold text-white">Загрузить обложку с устройства</p>
                <p className="text-[10px] text-[#9da7ba]">Формат JPG, PNG, WebP · До 5 MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[rgba(186,215,247,0.2)] group h-40">
                <img 
                  src={imagePreviewUrl} 
                  alt="Превью обложки" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-[#ffab91] hover:bg-black transition-colors"
                  title="Удалить обложку"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Краткое описание *</label>
            <textarea
              required
              rows={2}
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              placeholder="О чем мероприятие, для кого и какой результат..."
              className="glass-input text-xs !rounded-2xl"
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">Дата проведения</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="glass-input text-xs font-mono"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Время</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="glass-input text-xs font-mono"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Локация</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value, locationShort: e.target.value })}
              className="glass-input text-xs"
            />
          </div>

          {/* Toggle Pitching with Projects */}
          <div className="p-4 rounded-2xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.12)] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Защита проектов стартапов</h4>
                <p className="text-[11px] text-[#9da7ba]">Принимать регистрацию команд с PDF-деками</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasProjects: !formData.hasProjects })}
                className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  formData.hasProjects ? 'bg-[#663af3]' : 'bg-[rgba(186,215,247,0.15)]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.hasProjects ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div style={{ marginTop: '8px', paddingBottom: '16px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-violet text-sm !py-4 font-bold justify-center rounded-full shadow-[0_6px_28px_rgba(102,58,243,0.5)]"
            >
              {isSubmitting ? 'Загрузка обложки и публикация...' : 'Опубликовать мероприятие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
