import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  Star,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  Crown,
  Gift,
  Target,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

export function Profile() {
  const { user, setUser, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedData.name);
      formData.append('email', editedData.email);
      formData.append('phone', editedData.phone || '');
      formData.append('address', editedData.address || '');
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        addNotification({ 
          id: Date.now(), 
          text: 'Profile updated successfully!', 
          type: 'success' 
        });
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        const error = await res.json();
        addNotification({ 
          id: Date.now(), 
          text: error.message || 'Failed to update profile', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      addNotification({ 
        id: Date.now(), 
        text: 'Network error occurred', 
        type: 'error' 
      });
    }
  };

  const handleCancel = () => {
    setEditedData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Calculate user statistics
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }) : 'Recently';
  
  const totalReviews = user?.reviewCount || 0;
  const achievementCount = user?.achievements?.length || 0;
  const level = Math.floor((user?.points || 0) / 10000) + 1;
  const progressToNextLevel = ((user?.points || 0) % 10000) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl mb-6"
          style={{
            background: 'linear-gradient(135deg, #B87333 0%, #4A2C2A 50%, #B87333 100%)',
            boxShadow: '0 20px 60px rgba(184, 115, 51, 0.3)',
          }}
        >
          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <motion.div
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <motion.div
              animate={{ 
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-5xl relative overflow-hidden"
                  style={{
                    background: (imagePreview || user?.profileImage)
                      ? 'transparent'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px)',
                    border: '4px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                  
                  {/* Level badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: '3px solid white',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.5)',
                    }}
                  >
                    <span className="text-white text-xs font-bold">{level}</span>
                  </motion.div>
                </motion.div>
                
                {/* Camera icon overlay on hover */}
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="profileImageInput"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <motion.label
                      htmlFor="profileImageInput"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </motion.label>
                  </>
                )}
              </div>

              {/* Image upload indicator */}
              {isEditing && selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-0 right-0 text-center"
                >
                  <span className="text-white text-xs bg-green-500 px-3 py-1 rounded-full">
                    ✓ New photo selected
                  </span>
                </motion.div>
              )}

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {user?.name || 'User Name'}
                  </h1>
                  {user?.role === 'admin' && (
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Shield className="w-6 h-6 text-white" fill="white" />
                    </motion.div>
                  )}
                </div>
                
                <p className="text-white/90 mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Crown className="w-4 h-4" />
                  Level {level} • {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-white font-semibold">
                      {(user?.points || 0).toLocaleString()} Points
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Trophy className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold">
                      Rank #{user?.rank || user?.rankPosition || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold">
                      Since {memberSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="md:ml-auto">
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                    style={{
                      background: 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                      style={{
                        background: 'rgba(16, 185, 129, 0.9)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                      style={{
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 text-sm font-medium">
                  Level {level} Progress
                </span>
                <span className="text-white/90 text-sm font-medium">
                  {progressToNextLevel.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-6"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-caramel" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <InfoField
                  icon={User}
                  label="Full Name"
                  value={editedData.name}
                  isEditing={isEditing}
                  onChange={(val) => setEditedData({ ...editedData, name: val })}
                />
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={editedData.email}
                  isEditing={isEditing}
                  onChange={(val) => setEditedData({ ...editedData, email: val })}
                />
                <InfoField
                  icon={Phone}
                  label="Phone Number"
                  value={editedData.phone}
                  isEditing={isEditing}
                  onChange={(val) => setEditedData({ ...editedData, phone: val })}
                  placeholder="+1 (555) 000-0000"
                />
                <InfoField
                  icon={MapPin}
                  label="Address"
                  value={editedData.address}
                  isEditing={isEditing}
                  onChange={(val) => setEditedData({ ...editedData, address: val })}
                  placeholder="Enter your address"
                />
              </div>
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-6"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-caramel" />
                Your Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={Star}
                  label="Total Points"
                  value={(user?.points || 0).toLocaleString()}
                  color="#B87333"
                />
                <StatCard
                  icon={Award}
                  label="Rank"
                  value={`#${user?.rank || user?.rankPosition || '-'}`}
                  color="#4A2C2A"
                />
                <StatCard
                  icon={Gift}
                  label="Reviews"
                  value={totalReviews}
                  color="#B87333"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Achievements"
                  value={achievementCount}
                  color="#10b981"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-6"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-caramel" />
                Account Status
              </h3>

              <div className="space-y-3">
                <StatusItem
                  icon={CheckCircle}
                  label="Email Verified"
                  status={user?.emailVerified ? 'Verified' : 'Not Verified'}
                  isActive={user?.emailVerified}
                />
                <StatusItem
                  icon={Shield}
                  label="Account Type"
                  status={user?.role === 'admin' ? 'Admin' : 'User'}
                  isActive={true}
                />
                <StatusItem
                  icon={Zap}
                  label="Status"
                  status="Active"
                  isActive={true}
                />
              </div>
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-6"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-caramel" />
                Recent Activity
              </h3>

              <div className="space-y-3">
                <ActivityItem
                  icon={Star}
                  text="Earned 500 points"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon={Gift}
                  text="Posted a review"
                  time="1 day ago"
                />
                <ActivityItem
                  icon={TrendingUp}
                  text="Rank improved to #5"
                  time="3 days ago"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Components
function InfoField({ icon: Icon, label, value, isEditing, onChange, placeholder }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 p-2 rounded-lg" style={{ background: '#FFF7ED' }}>
        <Icon className="w-5 h-5 text-caramel" />
      </div>
      <div className="flex-1">
        <label className="text-sm text-gray-500 mb-1 block">{label}</label>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        ) : (
          <p className="text-gray-900 font-medium">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
      className="p-4 rounded-xl text-center"
      style={{
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        border: '1px solid rgba(184, 115, 51, 0.2)',
      }}
    >
      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </motion.div>
  );
}

function StatusItem({ icon: Icon, label, status, isActive }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
        {status}
      </span>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="p-1.5 rounded-lg" style={{ background: '#FFF7ED' }}>
        <Icon className="w-4 h-4 text-caramel" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{text}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// Missing Trophy import
import { Trophy } from 'lucide-react';

export default Profile;
