import React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings } from 'lucide-react';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

export function PanelSelector({ onSelect }) {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6 text-center" whileHover={{ y: -6 }}>
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br from-vendor-500 to-orange-600 text-white mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">User</h3>
          <p className="text-gray-600 mb-4">Personal dashboard for members</p>
          <PrimaryButton onClick={() => onSelect('user')}>Enter as User</PrimaryButton>
        </motion.div>

        <motion.div className="glass-card p-6 text-center" whileHover={{ y: -6 }}>
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br from-vendor-500 to-orange-600 text-white mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Admin</h3>
          <p className="text-gray-600 mb-4">System and user management</p>
          <PrimaryButton onClick={() => onSelect('admin')}>Enter as Admin</PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}

export default PanelSelector;
